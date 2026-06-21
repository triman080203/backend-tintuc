using FluentValidation;
using MediatR;
using Microsoft.EntityFrameworkCore;
using System.Reflection;
using DXC_Core.API.Data.CoreContext;
using DXC_Core.API.Data.FileContext;
using DXC_Core.API.Data.ZaloMiniAppContext;
using DXC_Core.API.Shared.Middleware;
using DXC_Core.API.Shared.Services;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.IdentityModel.Tokens;
using System.Text;
using Microsoft.OpenApi.Models;
using Microsoft.AspNetCore.RateLimiting;
using System.Threading.RateLimiting;
using DXC_Core.API;
using Microsoft.AspNetCore.StaticFiles;
using Microsoft.Extensions.FileProviders;
using Microsoft.EntityFrameworkCore.Diagnostics;

var builder = WebApplication.CreateBuilder(args);
var executingAssembly = Assembly.GetExecutingAssembly();
// Thêm dịch vụ HttpContextAccessor
builder.Services.AddHttpContextAccessor();
builder.Services.AddSingleton<DbCommandInterceptor, DXC_Core.API.Shared.Diagnostics.SqlCommandLoggingInterceptor>();

// --- Bắt đầu phần cấu hình dịch vụ ---

// 1. Đăng ký CoreDbContext với chuỗi kết nối từ appsettings.json
var coreConnectionString = builder.Configuration.GetConnectionString("CoreDbConnection");
builder.Services.AddDbContext<CoreDbContext>((sp, options) =>
    options.UseSqlServer(coreConnectionString)
           .AddInterceptors(sp.GetRequiredService<DbCommandInterceptor>()));

// 1.1. Đăng ký FileDbContext với chuỗi kết nối từ appsettings.json
var fileConnectionString = builder.Configuration.GetConnectionString("FileDbConnection") ?? coreConnectionString;
builder.Services.AddDbContext<FileDbContext>((sp, options) =>
    options.UseSqlServer(fileConnectionString)
           .AddInterceptors(sp.GetRequiredService<DbCommandInterceptor>()));

// 1.2. Đăng ký ZaloMiniAppDbContext với chuỗi kết nối từ appsettings.json
var zaloMiniAppConnectionString = builder.Configuration.GetConnectionString("ZaloMiniAppDbConnection");
builder.Services.AddDbContext<ZaloMiniAppDbContext>((sp, options) =>
    options.UseSqlServer(zaloMiniAppConnectionString)
           .AddInterceptors(sp.GetRequiredService<DbCommandInterceptor>()));


// 2. Đăng ký các dịch vụ dùng chung
builder.Services.AddScoped<IPasswordHasherService, PasswordHasherService>();

// 3. Đăng ký MediatR để xử lý các Command/Query
builder.Services.AddMediatR(config =>
    config.RegisterServicesFromAssembly(executingAssembly));

// 3.1. Đăng ký ValidationBehavior để tự động trigger FluentValidation
builder.Services.AddTransient(typeof(IPipelineBehavior<,>), typeof(DXC_Core.API.Shared.Behaviors.ValidationBehavior<,>));

// 4. Đăng ký các Validator của FluentValidation
builder.Services.AddValidatorsFromAssembly(executingAssembly);

// 5. Thêm dịch vụ cho Controller
builder.Services.AddControllers();
builder.Services.Configure<Microsoft.AspNetCore.Mvc.ApiBehaviorOptions>(options =>
{
    options.SuppressModelStateInvalidFilter = true;
});
builder.Services.AddAuthorization(options =>
{
    options.AddPolicy("FeedbackTrackingAccess", policy =>
        policy.RequireRole("admin", "feedback_tracking"));
});

// 5.1. Cấu hình giới hạn kích thước request cho upload file
builder.Services.Configure<Microsoft.AspNetCore.Http.Features.FormOptions>(options =>
{
    // Giới hạn kích thước file đơn lẻ: 100MB
    options.MultipartBodyLengthLimit = 100 * 1024 * 1024; // 100MB

    // Giới hạn kích thước tổng của form: 100MB
    options.ValueLengthLimit = 100 * 1024 * 1024; // 100MB

    // Giới hạn số lượng key trong form
    options.ValueCountLimit = 1024;

    // Giới hạn kích thước key name
    options.KeyLengthLimit = 2048;

    // Giới hạn số lượng file trong multipart form
    options.MultipartHeadersCountLimit = 16;

    // Giới hạn độ dài header của multipart
    options.MultipartHeadersLengthLimit = 16384;

    // Buffer size cho đọc multipart boundary
    options.MultipartBoundaryLengthLimit = 128;
});

// 6. Cấu hình Swagger/OpenAPI
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen(options =>
{
    // 1. Thêm định nghĩa cho JWT Bearer Security Scheme
    options.AddSecurityDefinition("Bearer", new OpenApiSecurityScheme
    {
        In = ParameterLocation.Header,
        Description = "Vui lòng nhập accessToken vào đây. Ví dụ: \"Bearer {token}\"",
        Name = "Authorization",
        Type = SecuritySchemeType.Http,
        BearerFormat = "JWT",
        Scheme = "bearer"
    });

    // 2. Thêm yêu cầu bảo mật, áp dụng scheme "Bearer" cho tất cả API
    options.AddSecurityRequirement(new OpenApiSecurityRequirement
    {
        {
            new OpenApiSecurityScheme
            {
                Reference = new OpenApiReference
                {
                    Type = ReferenceType.SecurityScheme,
                    Id = "Bearer"
                }
            },
            new string[] {}
        }
    });

    // 3. Cấu hình để Swagger sử dụng XML comments
    var xmlFilename = $"{Assembly.GetExecutingAssembly().GetName().Name}.xml";
    options.IncludeXmlComments(Path.Combine(AppContext.BaseDirectory, xmlFilename));

    options.CustomSchemaIds(type =>
    {
        if (!type.IsGenericType)
        {
            return type.IsNested && type.DeclaringType != null ? $"{type.DeclaringType.Name}_{type.Name}" : type.Name;
        }

        var genericArgs = string.Join("And", type.GetGenericArguments().Select(arg =>
        {
            if (!arg.IsGenericType) return arg.Name;
            var innerArgs = string.Join("", arg.GetGenericArguments().Select(a => a.Name));
            return $"{arg.Name.Split('`')[0]}{innerArgs}";
        }));

        return $"{type.Name.Split('`')[0]}Of{genericArgs}";
    });
});

// 7. Cấu hình Rate Limiting
builder.Services.AddRateLimiter(options =>
{
    options.AddFixedWindowLimiter("fixed", opt =>
    {
        opt.PermitLimit = 100; // Số lượng request tối đa
        opt.Window = TimeSpan.FromMinutes(1); // Trong 1 phút
        opt.QueueProcessingOrder = QueueProcessingOrder.OldestFirst;
        opt.QueueLimit = 10; // Số lượng request trong queue
    });

    options.AddSlidingWindowLimiter("sliding", opt =>
    {
        opt.PermitLimit = 50;
        opt.Window = TimeSpan.FromMinutes(1);
        opt.SegmentsPerWindow = 6;
        opt.QueueProcessingOrder = QueueProcessingOrder.OldestFirst;
        opt.QueueLimit = 5;
    });

    options.AddConcurrencyLimiter("concurrency", opt =>
    {
        opt.PermitLimit = 20;
        opt.QueueProcessingOrder = QueueProcessingOrder.OldestFirst;
        opt.QueueLimit = 5;
    });

    // Global rate limiter
    options.GlobalLimiter = PartitionedRateLimiter.Create<HttpContext, string>(httpContext =>
        RateLimitPartition.GetFixedWindowLimiter(
            partitionKey: httpContext.User.Identity?.Name ?? httpContext.Request.Headers.Host.ToString(),
            factory: partition => new FixedWindowRateLimiterOptions
            {
                AutoReplenishment = true,
                PermitLimit = 100,
                QueueLimit = 10,
                Window = TimeSpan.FromMinutes(1)
            }));
});

// 8. Cấu hình Response Caching
 

// Đăng ký dịch vụ Token
builder.Services.AddScoped<ITokenService, TokenService>();

// Đăng ký HttpClient cho Zalo API
builder.Services.AddHttpClient<IZaloPhoneNumberService, ZaloPhoneNumberService>();

// Thêm dịch vụ xác thực JWT
builder.Services.AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
    .AddJwtBearer(options =>
    {
        options.TokenValidationParameters = new TokenValidationParameters
        {
            ValidateIssuer = true,
            ValidateAudience = true,
            ValidateLifetime = true,
            ValidateIssuerSigningKey = true,
            ValidIssuer = builder.Configuration["Jwt:Issuer"],
            ValidAudience = builder.Configuration["Jwt:Audience"],
            IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(builder.Configuration["Jwt:Key"]!))
        };
    });
// --- Kết thúc phần cấu hình dịch vụ ---

// 7. Cấu hình CORS từ appsettings.json
var corsOrigins = builder.Configuration.GetSection("Cors:AllowedOrigins").Get<string[]>() ?? Array.Empty<string>();
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowConfiguredOrigins",
        policyBuilder =>
        {
            if (corsOrigins.Length > 0)
            {
                policyBuilder.WithOrigins(corsOrigins)
                             .AllowAnyHeader()
                             .AllowAnyMethod();
            }
            else
            {
                policyBuilder.AllowAnyOrigin()
                             .AllowAnyHeader()
                             .AllowAnyMethod();
            }
        });
});

var app = builder.Build();

// Thực hiện migrate database khi ứng dụng khởi động
using (var scope = app.Services.CreateScope())
{
    var coreDbContext = scope.ServiceProvider.GetRequiredService<CoreDbContext>();
    var fileDbContext = scope.ServiceProvider.GetRequiredService<FileDbContext>();
    var zaloMiniAppDbContext = scope.ServiceProvider.GetRequiredService<ZaloMiniAppDbContext>();

    // Áp dụng migrations cho từng DbContext
    coreDbContext.Database.Migrate();
    fileDbContext.Database.Migrate();
    zaloMiniAppDbContext.Database.Migrate();
}

// --- Bắt đầu cấu hình pipeline HTTP request ---

if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

// Sử dụng CORS policy từ configuration
app.UseCors("AllowConfiguredOrigins");

// Thêm middleware xử lý lỗi toàn cục (phải đặt ở đầu)
app.UseMiddleware<GlobalExceptionHandler>();

app.UseHttpsRedirection();

// Thêm middleware xác thực và phân quyền
app.UseAuthentication(); // Sẽ thêm ở các chức năng sau
app.UseAuthorization();

// Thêm middleware rate limiting
app.UseRateLimiter();

// Thêm middleware response caching
 

// Cấu hình static file serving cho thư mục uploads
var uploadsPath = Path.Combine(app.Environment.ContentRootPath, "uploads");
if (!Directory.Exists(uploadsPath))
{
    Directory.CreateDirectory(uploadsPath);
}

var staticFileOptions = new StaticFileOptions
{
    FileProvider = new PhysicalFileProvider(uploadsPath),
    RequestPath = "/uploads"
};

// Thêm các MIME types cho các file extensions thường dùng
var provider = new FileExtensionContentTypeProvider();
provider.Mappings[".webp"] = "image/webp";
provider.Mappings[".svg"] = "image/svg+xml";
staticFileOptions.ContentTypeProvider = provider;

app.UseStaticFiles(staticFileOptions);

// Serve static files từ React frontend dist folder (SPA)
app.UseDefaultFiles(new DefaultFilesOptions
{
    DefaultFileNames = new[] { "index.html" }
});
app.UseStaticFiles();

// Ánh xạ các request đến Controller
app.MapControllers();

// SPA fallback routing - PHẢI ở cuối cùng để catch tất cả remaining requests
app.MapFallbackToFile("/index.html");

// --- Kết thúc cấu hình pipeline ---

app.Run();
