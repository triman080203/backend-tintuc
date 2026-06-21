using DXC_Core.API.Data.ZaloMiniAppContext.Models.Places;
using DXC_Core.API.Data.ZaloMiniAppContext.Models.Services;
using DXC_Core.API.Data.ZaloMiniAppContext.Models.Services.IconManagement;
using DXC_Core.API.Data.ZaloMiniAppContext.Models.Feedback;
using DXC_Core.API.Data.ZaloMiniAppContext.Models.Products;
using DXC_Core.API.Data.ZaloMiniAppContext.Models.Users;
using DXC_Core.API.Data.ZaloMiniAppContext.Models.KhaoSat;
using DXC_Core.API.Data.ZaloMiniAppContext.Models.News;
using DXC_Core.API.Data.ZaloMiniAppContext.Models.Booking;
using DXC_Core.API.Data.ZaloMiniAppContext.Models.Payment;
using Microsoft.EntityFrameworkCore;

namespace DXC_Core.API.Data.ZaloMiniAppContext;

public class ZaloMiniAppDbContext : DbContext
{
    public ZaloMiniAppDbContext(DbContextOptions<ZaloMiniAppDbContext> options) : base(options)
    {
    }

    // PLACES Schema
    public DbSet<Hotel> Hotels { get; set; }
    public DbSet<HotelImage> HotelImages { get; set; }
    public DbSet<Restaurant> Restaurants { get; set; }
    public DbSet<RestaurantImage> RestaurantImages { get; set; }
    public DbSet<Homestay> Homestays { get; set; }
    public DbSet<HomestayImage> HomestayImages { get; set; }
    public DbSet<Destination> Destinations { get; set; }
    public DbSet<DestinationImage> DestinationImages { get; set; }

    // NEWS Schema
    public DbSet<Article> Articles { get; set; }

    // BOOKING Schema
    public DbSet<Tour> Tours { get; set; }
    public DbSet<TourImage> TourImages { get; set; }
    public DbSet<Ticket> Tickets { get; set; }
    public DbSet<BookingOrder> BookingOrders { get; set; }

    // PAYMENT Schema
    public DbSet<PaymentTransaction> PaymentTransactions { get; set; }

    // PRODUCTS Schema
    public DbSet<OcopProductCategory> OcopProductCategories { get; set; }
    public DbSet<OcopEnterprise> OcopEnterprises { get; set; }
    public DbSet<OcopEnterpriseDocument> OcopEnterpriseDocuments { get; set; }
    public DbSet<OcopProduct> OcopProducts { get; set; }
    public DbSet<OcopProductImage> OcopProductImages { get; set; }

    // SERVICES Schema
    public DbSet<HotlineCategory> HotlineCategories { get; set; }
    public DbSet<Hotline> Hotlines { get; set; }
    public DbSet<SupportGroupCategory> SupportGroupCategories { get; set; }
    public DbSet<SupportGroup> SupportGroups { get; set; }
    public DbSet<Banner> Banners { get; set; }
    public DbSet<UserPhoneNumber> UserPhoneNumbers { get; set; }
    public DbSet<TotalUser> TotalUsers { get; set; }

    // Icon Management Schema
    public DbSet<IconCategory> IconCategories { get; set; }
    public DbSet<IconGroup> IconGroups { get; set; }
    public DbSet<Icon> Icons { get; set; }

    // FEEDBACK Schema
    public DbSet<FeedbackStatus> FeedbackStatuses { get; set; }
    public DbSet<Feedback> Feedbacks { get; set; }
    public DbSet<FeedbackAttachment> FeedbackAttachments { get; set; }
    public DbSet<FeedbackProcessing> FeedbackProcessings { get; set; }
    public DbSet<FeedbackResponse> FeedbackResponses { get; set; }
    public DbSet<FeedbackResponseAttachment> FeedbackResponseAttachments { get; set; }

    // KHAOSAT Schema
    public DbSet<Survey> KhaoSats { get; set; }
    public DbSet<Question> KhaoSatCauHois { get; set; }
    public DbSet<Answer> KhaoSatTraLois { get; set; }
    public DbSet<EssayQuestion> KhaoSatTuLuans { get; set; }
    public DbSet<OtherOpinion> KhaoSatYKienKhacs { get; set; }
    public DbSet<SurveyResponse> KhaoSatResponses { get; set; }
    public DbSet<EssayResponse> KhaoSatEssayResponses { get; set; }

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        base.OnModelCreating(modelBuilder);

        // Configure PLACES Schema
        ConfigurePlacesSchema(modelBuilder);

        // Configure SERVICES Schema
        ConfigureServicesSchema(modelBuilder);

        // Configure PRODUCTS Schema
        ConfigureProductsSchema(modelBuilder);

        // Configure FEEDBACK Schema
        ConfigureFeedbackSchema(modelBuilder);

        // Configure KHAOSAT Schema
        ConfigureKhaoSatSchema(modelBuilder);

        // Configure NEW schemas
        ConfigureNewsSchema(modelBuilder);
        ConfigureBookingSchema(modelBuilder);
        ConfigurePaymentSchema(modelBuilder);
    }

    private static void ConfigurePlacesSchema(ModelBuilder modelBuilder)
    {
        // Hotel Configuration
        modelBuilder.Entity<Hotel>(entity =>
        {
            entity.ToTable("Hotels", schema: "PLACES");
            entity.HasKey(h => h.Id);
            
            entity.Property(h => h.Id)
                .ValueGeneratedOnAdd();
                
            entity.Property(h => h.PublicId)
                .HasDefaultValueSql("NEWSEQUENTIALID()");
                
            entity.Property(h => h.Name)
                .IsRequired()
                .HasMaxLength(255);
                
            entity.Property(h => h.Description)
                .HasColumnType("nvarchar(max)");
                
            entity.Property(h => h.Address)
                .HasMaxLength(500);
                
            entity.Property(h => h.PhoneNumber)
                .HasMaxLength(20);
                
            entity.Property(h => h.Email)
                .HasMaxLength(100);
                
            entity.Property(h => h.Website)
                .HasMaxLength(255);
                
            entity.Property(h => h.OperatingHours)
                .HasMaxLength(100);
                
            entity.Property(h => h.Latitude)
                .HasColumnType("decimal(10, 8)");
                
            entity.Property(h => h.Longitude)
                .HasColumnType("decimal(11, 8)");
                
            entity.Property(h => h.VR360Link)
                .HasMaxLength(500);
                
            entity.Property(h => h.PriceFrom)
                .HasColumnType("decimal(18, 2)");
                
            entity.Property(h => h.PriceFromCurrency)
                .HasMaxLength(10);
                
            // TenantId property removed as per database level isolation approach
                
            entity.Property(h => h.IsActive)
                .HasDefaultValue(true);
                
            entity.Property(h => h.CreatedAt)
                .HasDefaultValueSql("GETUTCDATE()");
                
            entity.Property(h => h.UpdatedAt)
                .HasDefaultValueSql("GETUTCDATE()");

            // Indexes
            entity.HasIndex(h => h.PublicId).IsUnique();
            // TenantId indexes removed as per database level isolation approach
        });

        // HotelImage Configuration
        modelBuilder.Entity<HotelImage>(entity =>
        {
            entity.ToTable("HotelImages", schema: "PLACES");
            entity.HasKey(hi => hi.Id);
            
            entity.Property(hi => hi.Id)
                .ValueGeneratedOnAdd();

            entity.Property(hi => hi.PublicId)
                .HasDefaultValueSql("NEWSEQUENTIALID()");

            entity.HasIndex(hi => hi.PublicId)
                .IsUnique();
                
            entity.Property(hi => hi.ImageUrl)
                .IsRequired()
                .HasMaxLength(500);
                
            entity.Property(hi => hi.ImagePublicId)
                .IsRequired();
                
            entity.Property(hi => hi.DisplayOrder)
                .HasDefaultValue(0);
                
            entity.Property(hi => hi.IsPrimary)
                .HasDefaultValue(false);
                
            entity.Property(hi => hi.Caption)
                .HasMaxLength(255);
                
            // TenantId property removed as per database level isolation approach
                
            entity.Property(hi => hi.CreatedAt)
                .HasDefaultValueSql("GETUTCDATE()");

            // Foreign Key
            entity.HasOne<Hotel>()
                .WithMany(h => h.Images)
                .HasForeignKey(hi => hi.HotelId)
                .OnDelete(DeleteBehavior.Cascade);

            // Indexes
            entity.HasIndex(hi => hi.HotelId);
            // TenantId index removed as per database level isolation approach
            entity.HasIndex(hi => new { hi.HotelId, hi.DisplayOrder });
        });

        // Restaurant Configuration
        modelBuilder.Entity<Restaurant>(entity =>
        {
            entity.ToTable("Restaurants", schema: "PLACES");
            entity.HasKey(r => r.Id);

            entity.Property(r => r.Id)
                .ValueGeneratedOnAdd();

            entity.Property(r => r.PublicId)
                .HasDefaultValueSql("NEWSEQUENTIALID()");

            entity.Property(r => r.Name)
                .IsRequired()
                .HasMaxLength(255);

            entity.Property(r => r.Description)
                .HasColumnType("nvarchar(max)");

            entity.Property(r => r.Address)
                .HasMaxLength(500);

            entity.Property(r => r.PhoneNumber)
                .HasMaxLength(20);

            entity.Property(r => r.OperatingHours)
                .HasMaxLength(100);

            entity.Property(r => r.Schedule)
                .HasColumnType("nvarchar(max)");

            entity.Property(r => r.Latitude)
                .HasColumnType("decimal(10, 8)");

            entity.Property(r => r.Longitude)
                .HasColumnType("decimal(11, 8)");

            entity.Property(r => r.VR360Link)
                .HasMaxLength(500);

            entity.Property(r => r.Category)
                .HasMaxLength(100);

            entity.Property(r => r.AveragePriceRange)
                .HasMaxLength(50);

            entity.Property(r => r.IsActive)
                .HasDefaultValue(true);

            entity.Property(r => r.CreatedAt)
                .HasDefaultValueSql("GETUTCDATE()");

            entity.Property(r => r.UpdatedAt)
                .HasDefaultValueSql("GETUTCDATE()");

            // Indexes
            entity.HasIndex(r => r.PublicId).IsUnique();
        });

        // RestaurantImage Configuration
        modelBuilder.Entity<RestaurantImage>(entity =>
        {
            entity.ToTable("RestaurantImages", schema: "PLACES");
            entity.HasKey(ri => ri.Id);

            entity.Property(ri => ri.Id)
                .ValueGeneratedOnAdd();

            entity.Property(ri => ri.PublicId)
                .HasDefaultValueSql("NEWSEQUENTIALID()");

            entity.HasIndex(ri => ri.PublicId)
                .IsUnique();

            entity.Property(ri => ri.ImageUrl)
                .IsRequired()
                .HasMaxLength(500);

            entity.Property(ri => ri.ImagePublicId)
                .IsRequired();

            entity.Property(ri => ri.DisplayOrder)
                .HasDefaultValue(0);

            entity.Property(ri => ri.IsPrimary)
                .HasDefaultValue(false);

            entity.Property(ri => ri.Caption)
                .HasMaxLength(255);

            entity.Property(ri => ri.CreatedAt)
                .HasDefaultValueSql("GETUTCDATE()");

            // Foreign Key
            entity.HasOne<Restaurant>()
                .WithMany(r => r.Images)
                .HasForeignKey(ri => ri.RestaurantId)
                .OnDelete(DeleteBehavior.Cascade);

            // Indexes
            entity.HasIndex(ri => ri.RestaurantId);
            entity.HasIndex(ri => new { ri.RestaurantId, ri.DisplayOrder });
        });

        // Homestay Configuration
        modelBuilder.Entity<Homestay>(entity =>
        {
            entity.ToTable("Homestays", schema: "PLACES");
            entity.HasKey(h => h.Id);

            entity.Property(h => h.Id)
                .ValueGeneratedOnAdd();

            entity.Property(h => h.PublicId)
                .HasDefaultValueSql("NEWSEQUENTIALID()");

            entity.Property(h => h.Name)
                .IsRequired()
                .HasMaxLength(255);

            entity.Property(h => h.Description)
                .HasColumnType("nvarchar(max)");

            entity.Property(h => h.Address)
                .HasMaxLength(500);

            entity.Property(h => h.PhoneNumber)
                .HasMaxLength(20);

            entity.Property(h => h.AveragePrice)
                .HasColumnType("decimal(18, 2)");

            entity.Property(h => h.AveragePriceCurrency)
                .HasMaxLength(10);

            entity.Property(h => h.Latitude)
                .HasColumnType("decimal(10, 8)");

            entity.Property(h => h.Longitude)
                .HasColumnType("decimal(11, 8)");

            entity.Property(h => h.Website)
                .HasMaxLength(255);

            entity.Property(h => h.LinkVitri)
                .HasMaxLength(500);

            entity.Property(h => h.IsActive)
                .HasDefaultValue(true);

            entity.Property(h => h.CreatedAt)
                .HasDefaultValueSql("GETUTCDATE()");

            entity.Property(h => h.UpdatedAt)
                .HasDefaultValueSql("GETUTCDATE()");

            // Indexes
            entity.HasIndex(h => h.PublicId).IsUnique();
        });

        // HomestayImage Configuration
        modelBuilder.Entity<HomestayImage>(entity =>
        {
            entity.ToTable("HomestayImages", schema: "PLACES");
            entity.HasKey(hi => hi.Id);

            entity.Property(hi => hi.Id)
                .ValueGeneratedOnAdd();

            entity.Property(hi => hi.PublicId)
                .HasDefaultValueSql("NEWSEQUENTIALID()");

            entity.HasIndex(hi => hi.PublicId)
                .IsUnique();

            entity.Property(hi => hi.ImageUrl)
                .IsRequired()
                .HasMaxLength(500);

            entity.Property(hi => hi.ImagePublicId)
                .IsRequired();

            entity.Property(hi => hi.DisplayOrder)
                .HasDefaultValue(0);

            entity.Property(hi => hi.IsPrimary)
                .HasDefaultValue(false);

            entity.Property(hi => hi.Caption)
                .HasMaxLength(255);

            entity.Property(hi => hi.CreatedAt)
                .HasDefaultValueSql("GETUTCDATE()");

            // Foreign Key
            entity.HasOne<Homestay>()
                .WithMany(h => h.Images)
                .HasForeignKey(hi => hi.HomestayId)
                .OnDelete(DeleteBehavior.Cascade);

            // Indexes
            entity.HasIndex(hi => hi.HomestayId);
            entity.HasIndex(hi => new { hi.HomestayId, hi.DisplayOrder });
        });
        // Destination Configuration
        modelBuilder.Entity<Destination>(entity =>
        {
            entity.ToTable("Destinations", schema: "PLACES");
            entity.HasKey(d => d.Id);
            entity.Property(d => d.PublicId).HasDefaultValueSql("NEWSEQUENTIALID()");
            entity.HasIndex(d => d.PublicId).IsUnique();
            entity.Property(d => d.Name).IsRequired().HasMaxLength(255);
            entity.Property(d => d.Description).HasColumnType("nvarchar(max)");
            entity.Property(d => d.Address).HasMaxLength(500);
            entity.Property(d => d.TimeLimit).HasMaxLength(100);
            entity.Property(d => d.Tag).HasMaxLength(100);
            entity.Property(d => d.Latitude).HasColumnType("decimal(10, 8)");
            entity.Property(d => d.Longitude).HasColumnType("decimal(11, 8)");
            entity.Property(d => d.VR360Link).HasMaxLength(500);
            entity.Property(d => d.IsActive).HasDefaultValue(true);
            entity.Property(d => d.CreatedAt).HasDefaultValueSql("GETUTCDATE()");
            entity.Property(d => d.UpdatedAt).HasDefaultValueSql("GETUTCDATE()");
        });

        // DestinationImage Configuration
        modelBuilder.Entity<DestinationImage>(entity =>
        {
            entity.ToTable("DestinationImages", schema: "PLACES");
            entity.HasKey(di => di.Id);
            entity.Property(di => di.PublicId).HasDefaultValueSql("NEWSEQUENTIALID()");
            entity.HasIndex(di => di.PublicId).IsUnique();
            entity.Property(di => di.ImageUrl).IsRequired().HasMaxLength(500);
            entity.Property(di => di.ImagePublicId).IsRequired();
            entity.Property(di => di.IsPrimary).HasDefaultValue(false);
            entity.Property(di => di.Caption).HasMaxLength(255);
            entity.Property(di => di.CreatedAt).HasDefaultValueSql("GETUTCDATE()");
            entity.HasOne(di => di.Destination).WithMany(d => d.Images).HasForeignKey(di => di.DestinationId).OnDelete(DeleteBehavior.Cascade);
        });
    }

    private static void ConfigureServicesSchema(ModelBuilder modelBuilder)
    {
        // HotlineCategory Configuration
        modelBuilder.Entity<HotlineCategory>(entity =>
        {
            entity.ToTable("HotlineCategories", schema: "SERVICES");
            entity.Property(c => c.PublicId).HasDefaultValueSql("NEWSEQUENTIALID()");
            entity.HasIndex(c => c.PublicId).IsUnique();
            entity.HasIndex(c => c.Name).IsUnique();
            entity.Property(c => c.Name).HasMaxLength(255).IsRequired();
            entity.Property(c => c.Description).HasMaxLength(1000);
            entity.Property(c => c.ThuTu).HasDefaultValue(0);
            entity.Property(c => c.IsActive).HasDefaultValue(true);
            entity.Property(c => c.CreatedAt).HasDefaultValueSql("GETUTCDATE()");
            entity.Property(c => c.UpdatedAt).HasDefaultValueSql("GETUTCDATE()");
        });

        // Hotline Configuration
        modelBuilder.Entity<Hotline>(entity =>
        {
            entity.ToTable("Hotlines", schema: "SERVICES");
            entity.Property(h => h.PublicId).HasDefaultValueSql("NEWSEQUENTIALID()");
            entity.HasIndex(h => h.PublicId).IsUnique();
            entity.Property(h => h.PhoneNumber).HasMaxLength(20).IsRequired();
            entity.Property(h => h.ContactName).HasMaxLength(255).IsRequired();
            entity.Property(h => h.Description).HasMaxLength(500);
            entity.Property(h => h.ThuTu).HasDefaultValue(0);
            entity.Property(h => h.IsActive).HasDefaultValue(true);
            entity.Property(h => h.CreatedAt).HasDefaultValueSql("GETUTCDATE()");
            entity.Property(h => h.UpdatedAt).HasDefaultValueSql("GETUTCDATE()");

            entity.HasOne(h => h.Category)
                .WithMany(c => c.Hotlines)
                .HasForeignKey(h => h.CategoryId)
                .OnDelete(DeleteBehavior.Cascade);
        });

        // SupportGroupCategory Configuration
        modelBuilder.Entity<SupportGroupCategory>(entity =>
        {
            entity.ToTable("SupportGroupCategories", schema: "SERVICES");
            entity.Property(c => c.PublicId).HasDefaultValueSql("NEWSEQUENTIALID()");
            entity.HasIndex(c => c.PublicId).IsUnique();
            entity.HasIndex(c => c.Name).IsUnique();
            entity.Property(c => c.Name).HasMaxLength(255).IsRequired();
            entity.Property(c => c.Description).HasMaxLength(1000);
            entity.Property(c => c.IsActive).HasDefaultValue(true);
            entity.Property(c => c.CreatedAt).HasDefaultValueSql("GETUTCDATE()");
            entity.Property(c => c.UpdatedAt).HasDefaultValueSql("GETUTCDATE()");
        });

        // SupportGroup Configuration
        modelBuilder.Entity<SupportGroup>(entity =>
        {
            entity.ToTable("SupportGroups", schema: "SERVICES");
            entity.Property(sg => sg.PublicId).HasDefaultValueSql("NEWSEQUENTIALID()");
            entity.HasIndex(sg => sg.PublicId).IsUnique();
            entity.Property(sg => sg.GroupName).HasMaxLength(255).IsRequired();
            entity.Property(sg => sg.GroupLink).HasMaxLength(500).IsRequired();
            entity.Property(sg => sg.GroupType).HasMaxLength(50).IsRequired();
            entity.Property(sg => sg.Description).HasMaxLength(500);
            entity.Property(sg => sg.IsActive).HasDefaultValue(true);
            entity.Property(sg => sg.CreatedAt).HasDefaultValueSql("GETUTCDATE()");
            entity.Property(sg => sg.UpdatedAt).HasDefaultValueSql("GETUTCDATE()");

            entity.HasOne(sg => sg.Category)
                .WithMany(c => c.SupportGroups)
                .HasForeignKey(sg => sg.CategoryId)
                .OnDelete(DeleteBehavior.Cascade);
        });

        // Banner Configuration
        modelBuilder.Entity<Banner>(entity =>
        {
            entity.ToTable("Banners", schema: "SERVICES");
            entity.Property(b => b.PublicId).HasDefaultValueSql("NEWSEQUENTIALID()");
            entity.HasIndex(b => b.PublicId).IsUnique();
            entity.Property(b => b.Title).HasMaxLength(200).IsRequired();
            entity.Property(b => b.Position).HasMaxLength(20).IsRequired();
            entity.Property(b => b.BannerType).HasMaxLength(20).IsRequired();
            entity.Property(b => b.NativeParams).HasMaxLength(500);
            entity.Property(b => b.WebLink).HasMaxLength(500);
            entity.Property(b => b.IsActive).HasDefaultValue(true);
            entity.Property(b => b.CreatedAt).HasDefaultValueSql("GETUTCDATE()");
            entity.Property(b => b.UpdatedAt).HasDefaultValueSql("GETUTCDATE()");

            // Check constraints
            entity.ToTable(t => t.HasCheckConstraint("CK_Banners_Position", "[Position] IN ('top', 'middle', 'bottom')"));
            entity.ToTable(t => t.HasCheckConstraint("CK_Banners_Type", "[BannerType] IN ('native', 'web')"));

            // Indexes
            entity.HasIndex(b => b.ImagePublicId);
        });

        // IconCategory Configuration
        modelBuilder.Entity<IconCategory>(entity =>
        {
            entity.ToTable("IconCategories", schema: "SERVICES");
            entity.Property(c => c.PublicId).HasDefaultValueSql("NEWSEQUENTIALID()");
            entity.HasIndex(c => c.PublicId).IsUnique();
            entity.HasIndex(c => c.Name).IsUnique();
            entity.Property(c => c.Name).HasMaxLength(100).IsRequired();
            entity.Property(c => c.Description).HasMaxLength(500);
            entity.Property(c => c.DisplayOrder).HasDefaultValue(0);
            entity.Property(c => c.IsActive).HasDefaultValue(true);
            entity.Property(c => c.CreatedAt).HasDefaultValueSql("GETUTCDATE()");
            entity.Property(c => c.UpdatedAt).HasDefaultValueSql("GETUTCDATE()");
        });

        // IconGroup Configuration
        modelBuilder.Entity<IconGroup>(entity =>
        {
            entity.ToTable("IconGroups", schema: "SERVICES");
            entity.Property(g => g.PublicId).HasDefaultValueSql("NEWSEQUENTIALID()");
            entity.HasIndex(g => g.PublicId).IsUnique();
            entity.Property(g => g.Name).HasMaxLength(100).IsRequired();
            entity.Property(g => g.Description).HasMaxLength(500);
            entity.Property(g => g.DisplayOrder).HasDefaultValue(0);
            entity.Property(g => g.IsActive).HasDefaultValue(true);
            entity.Property(g => g.CreatedAt).HasDefaultValueSql("GETUTCDATE()");
            entity.Property(g => g.UpdatedAt).HasDefaultValueSql("GETUTCDATE()");
            entity.Property(g => g.ImageUrl).HasMaxLength(500);

            entity.HasOne(g => g.IconCategory)
                .WithMany(c => c.IconGroups)
                .HasForeignKey(g => g.IconCategoryId)
                .OnDelete(DeleteBehavior.Cascade);

            entity.HasIndex(g => g.IconCategoryId);
            entity.HasIndex(g => g.ImagePublicId);
        });

        // Icon Configuration
        modelBuilder.Entity<Icon>(entity =>
        {
            entity.ToTable("Icons", schema: "SERVICES");
            entity.Property(i => i.PublicId).HasDefaultValueSql("NEWSEQUENTIALID()");
            entity.HasIndex(i => i.PublicId).IsUnique();
            entity.Property(i => i.Name).HasMaxLength(100).IsRequired();
            entity.Property(i => i.Description).HasMaxLength(500);
            entity.Property(i => i.IconImageUrl).HasMaxLength(500).IsRequired();
            entity.Property(i => i.IconType).HasMaxLength(20).IsRequired();
            entity.Property(i => i.ScreenParams).HasMaxLength(1000);
            entity.Property(i => i.WebLink).HasMaxLength(500);
            entity.Property(i => i.LinkAndroid).HasColumnType("nvarchar(max)");
            entity.Property(i => i.LinkIOS).HasColumnType("nvarchar(max)");
            entity.Property(i => i.DisplayOrder).HasDefaultValue(0);
            entity.Property(i => i.IsActive).HasDefaultValue(true);
            entity.Property(i => i.CreatedAt).HasDefaultValueSql("GETUTCDATE()");
            entity.Property(i => i.UpdatedAt).HasDefaultValueSql("GETUTCDATE()");

            // Check constraints
            entity.ToTable(t => t.HasCheckConstraint("CK_Icons_Type", "[IconType] IN ('native', 'web')"));
            entity.ToTable(t => t.HasCheckConstraint("CK_Icons_Parent",
                "([IconCategoryId] IS NOT NULL AND [IconGroupId] IS NULL) OR " +
                "([IconCategoryId] IS NULL AND [IconGroupId] IS NOT NULL) OR " +
                "([IconCategoryId] IS NOT NULL AND [IconGroupId] IS NOT NULL)"));

            // Foreign Keys - Use NoAction to avoid multiple cascade paths
            entity.HasOne(i => i.IconCategory)
                .WithMany(c => c.Icons)
                .HasForeignKey(i => i.IconCategoryId)
                .OnDelete(DeleteBehavior.NoAction);

            entity.HasOne(i => i.IconGroup)
                .WithMany(g => g.Icons)
                .HasForeignKey(i => i.IconGroupId)
                .OnDelete(DeleteBehavior.NoAction);

            // Indexes
            entity.HasIndex(i => i.IconCategoryId);
            entity.HasIndex(i => i.IconGroupId);
            entity.HasIndex(i => new { i.IconCategoryId, i.DisplayOrder });
            entity.HasIndex(i => new { i.IconGroupId, i.DisplayOrder });
        });

        // UserPhoneNumber Configuration
        modelBuilder.Entity<UserPhoneNumber>(entity =>
        {
            entity.ToTable("UserPhoneNumbers", schema: "SERVICES");
            entity.Property(upn => upn.PublicId).HasDefaultValueSql("NEWSEQUENTIALID()");
            entity.HasIndex(upn => upn.PublicId).IsUnique();
            entity.Property(upn => upn.PhoneNumber).HasMaxLength(20).IsRequired();
            entity.Property(upn => upn.DisplayPhoneNumber).HasMaxLength(20);
            entity.Property(upn => upn.ZaloUserId).HasMaxLength(100);
            entity.Property(upn => upn.IsActive).HasDefaultValue(true);
            entity.Property(upn => upn.CreatedAt).HasDefaultValueSql("GETUTCDATE()");
            entity.Property(upn => upn.UpdatedAt).HasDefaultValueSql("GETUTCDATE()");

            // Indexes
            entity.HasIndex(upn => upn.PhoneNumber);
            entity.HasIndex(upn => upn.ZaloUserId);
            entity.HasIndex(upn => upn.IsActive);
        });

        // TotalUser Configuration
        modelBuilder.Entity<TotalUser>(entity =>
        {
            entity.ToTable("TotalUsers", schema: "SERVICES");
            entity.HasKey(t => t.Id);
            entity.Property(t => t.Id).ValueGeneratedOnAdd();
            entity.Property(t => t.UserId).HasMaxLength(100).IsRequired();
            entity.Property(t => t.Username).HasMaxLength(255).IsRequired();
            entity.Property(t => t.Avatar).HasMaxLength(500);
            entity.Property(t => t.PhanQuyen).HasMaxLength(100);

            // Indexes
            entity.HasIndex(t => t.UserId);
        });
    }

    private static void ConfigureFeedbackSchema(ModelBuilder modelBuilder)
    {
        // FeedbackStatus Configuration
        modelBuilder.Entity<FeedbackStatus>(entity =>
        {
            entity.ToTable("FeedbackStatus", schema: "FEEDBACK");
            entity.Property(s => s.PublicId).HasDefaultValueSql("NEWSEQUENTIALID()");
            entity.HasIndex(s => s.PublicId).IsUnique();
            entity.HasIndex(s => s.Code).IsUnique();
            entity.Property(s => s.Code).HasMaxLength(50).IsRequired();
            entity.Property(s => s.Name).HasMaxLength(100).IsRequired();
            entity.Property(s => s.Description).HasMaxLength(500);
            entity.Property(s => s.Color).HasMaxLength(20);
            entity.Property(s => s.IsActive).HasDefaultValue(true);
            entity.Property(s => s.CreatedAt).HasDefaultValueSql("GETUTCDATE()");
            entity.Property(s => s.UpdatedAt).HasDefaultValueSql("GETUTCDATE()");
        });

        // Feedback Configuration
        modelBuilder.Entity<Feedback>(entity =>
        {
            entity.ToTable("Feedback", schema: "FEEDBACK");
            entity.Property(f => f.PublicId).HasDefaultValueSql("NEWSEQUENTIALID()");
            entity.HasIndex(f => f.PublicId).IsUnique();
            entity.Property(f => f.Title).HasMaxLength(500).IsRequired();
            entity.Property(f => f.Content).IsRequired();
            entity.Property(f => f.FullName).HasMaxLength(200).IsRequired();
            entity.Property(f => f.PhoneNumber).HasMaxLength(20);
            entity.Property(f => f.Location).HasMaxLength(500);
            entity.Property(f => f.IsPublic).HasDefaultValue(false);
            entity.Property(f => f.IsActive).HasDefaultValue(true);
            entity.Property(f => f.CreatedAt).HasDefaultValueSql("GETUTCDATE()");
            entity.Property(f => f.UpdatedAt).HasDefaultValueSql("GETUTCDATE()");

            // Foreign Keys
            entity.HasOne(f => f.CurrentStatus)
                .WithMany(s => s.Feedbacks)
                .HasForeignKey(f => f.CurrentStatusId)
                .OnDelete(DeleteBehavior.Restrict);

            // Note: AssignedDepartmentId is a denormalized field storing int Id from COMMON.Department
            // No FK constraint defined - use CoreDbContext to lookup department details via PublicId

            // Indexes
            entity.HasIndex(f => f.CurrentStatusId);
            entity.HasIndex(f => f.AssignedDepartmentId);
        });

        // FeedbackAttachment Configuration
        modelBuilder.Entity<FeedbackAttachment>(entity =>
        {
            entity.ToTable("FeedbackAttachment", schema: "FEEDBACK");
            entity.Property(a => a.PublicId).HasDefaultValueSql("NEWSEQUENTIALID()");
            entity.HasIndex(a => a.PublicId).IsUnique();
            entity.Property(a => a.FileName).HasMaxLength(500).IsRequired();
            entity.Property(a => a.FileType).HasMaxLength(100);
            entity.Property(a => a.IsActive).HasDefaultValue(true);
            entity.Property(a => a.CreatedAt).HasDefaultValueSql("GETUTCDATE()");

            // Foreign Key
            entity.HasOne(a => a.Feedback)
                .WithMany(f => f.Attachments)
                .HasForeignKey(a => a.FeedbackId)
                .OnDelete(DeleteBehavior.Cascade);

            // Indexes
            entity.HasIndex(a => a.FeedbackId);
        });

        // FeedbackProcessing Configuration
        modelBuilder.Entity<FeedbackProcessing>(entity =>
        {
            entity.ToTable("FeedbackProcessing", schema: "FEEDBACK");
            entity.Property(p => p.PublicId).HasDefaultValueSql("NEWSEQUENTIALID()");
            entity.HasIndex(p => p.PublicId).IsUnique();
            entity.Property(p => p.ProcessingNote).HasMaxLength(1000);
            entity.Property(p => p.AssignedAt).HasDefaultValueSql("GETUTCDATE()");
            entity.Property(p => p.IsActive).HasDefaultValue(true);
            entity.Property(p => p.CreatedAt).HasDefaultValueSql("GETUTCDATE()");

            // Foreign Keys
            entity.HasOne(p => p.Feedback)
                .WithMany(f => f.Processings)
                .HasForeignKey(p => p.FeedbackId)
                .OnDelete(DeleteBehavior.Cascade);

            entity.HasOne(p => p.FromStatus)
                .WithMany(s => s.FromStatusProcessings)
                .HasForeignKey(p => p.FromStatusId)
                .OnDelete(DeleteBehavior.Restrict);

            entity.HasOne(p => p.ToStatus)
                .WithMany(s => s.ToStatusProcessings)
                .HasForeignKey(p => p.ToStatusId)
                .OnDelete(DeleteBehavior.Restrict);

            // Note: AssignedDepartmentId is a denormalized field storing int Id from COMMON.Department
            // No FK constraint defined - use CoreDbContext to lookup department details via PublicId

            // Indexes
            entity.HasIndex(p => p.FeedbackId);
            entity.HasIndex(p => p.FromStatusId);
            entity.HasIndex(p => p.ToStatusId);
            entity.HasIndex(p => p.AssignedDepartmentId);
        });

        // FeedbackResponse Configuration
        modelBuilder.Entity<FeedbackResponse>(entity =>
        {
            entity.ToTable("FeedbackResponse", schema: "FEEDBACK");
            entity.Property(r => r.PublicId).HasDefaultValueSql("NEWSEQUENTIALID()");
            entity.HasIndex(r => r.PublicId).IsUnique();
            entity.Property(r => r.ResponseContent).IsRequired();
            entity.Property(r => r.ResponseAttachments).HasMaxLength(1000);
            entity.Property(r => r.ApprovalNote).HasMaxLength(500);
            entity.Property(r => r.IsActive).HasDefaultValue(true);
            entity.Property(r => r.CreatedAt).HasDefaultValueSql("GETUTCDATE()");
            entity.Property(r => r.UpdatedAt).HasDefaultValueSql("GETUTCDATE()");

            // Foreign Keys
            entity.HasOne(r => r.Feedback)
                .WithMany(f => f.Responses)
                .HasForeignKey(r => r.FeedbackId)
                .OnDelete(DeleteBehavior.Cascade);

            // Note: DepartmentId is a denormalized field storing int Id from COMMON.Department
            // No FK constraint defined - use CoreDbContext to lookup department details via PublicId

            // Indexes
            entity.HasIndex(r => r.FeedbackId);
            entity.HasIndex(r => r.DepartmentId);
        });

        // FeedbackResponseAttachment Configuration
        modelBuilder.Entity<FeedbackResponseAttachment>(entity =>
        {
            entity.ToTable("FeedbackResponseAttachment", schema: "FEEDBACK");
            entity.Property(a => a.PublicId).HasDefaultValueSql("NEWSEQUENTIALID()");
            entity.HasIndex(a => a.PublicId).IsUnique();
            entity.Property(a => a.FileName).HasMaxLength(500).IsRequired();
            entity.Property(a => a.FileType).HasMaxLength(100);
            entity.Property(a => a.IsActive).HasDefaultValue(true);
            entity.Property(a => a.CreatedAt).HasDefaultValueSql("GETUTCDATE()");

            // Foreign Key
            entity.HasOne(a => a.FeedbackResponse)
                .WithMany(r => r.Attachments)
                .HasForeignKey(a => a.FeedbackResponseId)
                .OnDelete(DeleteBehavior.Cascade);

            // Indexes
            entity.HasIndex(a => a.FeedbackResponseId);
        });
    }

    private static void ConfigureProductsSchema(ModelBuilder modelBuilder)
    {
        // OcopProductCategory Configuration
        modelBuilder.Entity<OcopProductCategory>(entity =>
        {
            entity.ToTable("OcopProductCategories", schema: "PRODUCTS");
            entity.HasKey(c => c.Id);

            entity.Property(c => c.Id)
                .ValueGeneratedOnAdd();

            entity.Property(c => c.PublicId)
                .HasDefaultValueSql("NEWSEQUENTIALID()");

            entity.Property(c => c.Name)
                .IsRequired()
                .HasMaxLength(255);

            entity.Property(c => c.Description)
                .HasMaxLength(500);

            entity.Property(c => c.ImageUrl)
                .HasMaxLength(500);

            entity.Property(c => c.ImagePublicId);

            entity.Property(c => c.DisplayOrder)
                .HasDefaultValue(0);

            entity.Property(c => c.IsActive)
                .HasDefaultValue(true);

            entity.Property(c => c.CreatedAt)
                .HasDefaultValueSql("GETUTCDATE()");

            entity.Property(c => c.UpdatedAt)
                .HasDefaultValueSql("GETUTCDATE()");

            // Indexes
            entity.HasIndex(c => c.PublicId).IsUnique();
            entity.HasIndex(c => c.Name).IsUnique();
            entity.HasIndex(c => new { c.IsActive, c.DisplayOrder });
        });

        // OcopEnterprise Configuration
        modelBuilder.Entity<OcopEnterprise>(entity =>
        {
            entity.ToTable("OcopEnterprises", schema: "PRODUCTS");
            entity.HasKey(e => e.Id);

            entity.Property(e => e.Id)
                .ValueGeneratedOnAdd();

            entity.Property(e => e.PublicId)
                .HasDefaultValueSql("NEWSEQUENTIALID()");

            entity.Property(e => e.Name)
                .IsRequired()
                .HasMaxLength(255);

            entity.Property(e => e.PhoneNumber)
                .HasMaxLength(20);

            entity.Property(e => e.Representative)
                .HasMaxLength(255);

            entity.Property(e => e.TaxCode)
                .HasMaxLength(20);

            entity.Property(e => e.Address)
                .HasMaxLength(500);

            entity.Property(e => e.OcopCertificateNumber)
                .HasMaxLength(100);

            entity.Property(e => e.Latitude)
                .HasColumnType("decimal(10, 8)");

            entity.Property(e => e.Longitude)
                .HasColumnType("decimal(11, 8)");

            entity.Property(e => e.IsActive)
                .HasDefaultValue(true);

            entity.Property(e => e.CreatedAt)
                .HasDefaultValueSql("GETUTCDATE()");

            entity.Property(e => e.UpdatedAt)
                .HasDefaultValueSql("GETUTCDATE()");

            // Indexes
            entity.HasIndex(e => e.PublicId).IsUnique();
            entity.HasIndex(e => e.Name);
            entity.HasIndex(e => e.TaxCode);
            entity.HasIndex(e => new { e.Latitude, e.Longitude });
        });

        // OcopProduct Configuration
        modelBuilder.Entity<OcopProduct>(entity =>
        {
            entity.ToTable("OcopProducts", schema: "PRODUCTS");
            entity.HasKey(p => p.Id);

            entity.Property(p => p.Id)
                .ValueGeneratedOnAdd();

            entity.Property(p => p.PublicId)
                .HasDefaultValueSql("NEWSEQUENTIALID()");

            entity.Property(p => p.Name)
                .IsRequired()
                .HasMaxLength(255);

            entity.Property(p => p.Description)
                .HasColumnType("nvarchar(max)");

            entity.Property(p => p.ReferencePrice)
                .HasColumnType("decimal(18, 2)");

            entity.Property(p => p.PromotionalPrice)
                .HasColumnType("decimal(18, 2)");

            entity.Property(p => p.ContactPhone)
                .HasMaxLength(20);

            entity.Property(p => p.ContactAddress)
                .HasMaxLength(500);

            entity.Property(p => p.Latitude)
                .HasColumnType("decimal(10, 8)");

            entity.Property(p => p.Longitude)
                .HasColumnType("decimal(11, 8)");

            entity.Property(p => p.IsActive)
                .HasDefaultValue(true);

            entity.Property(p => p.CreatedAt)
                .HasDefaultValueSql("GETUTCDATE()");

            entity.Property(p => p.UpdatedAt)
                .HasDefaultValueSql("GETUTCDATE()");

            // Foreign Keys
            entity.HasOne(p => p.Category)
                .WithMany(c => c.Products)
                .HasForeignKey(p => p.CategoryId)
                .OnDelete(DeleteBehavior.Cascade);

            entity.HasOne(p => p.Enterprise)
                .WithMany(e => e.Products)
                .HasForeignKey(p => p.EnterpriseId)
                .OnDelete(DeleteBehavior.Cascade);

            // Indexes
            entity.HasIndex(p => p.PublicId).IsUnique();
            entity.HasIndex(p => p.Name);
            entity.HasIndex(p => p.CategoryId);
            entity.HasIndex(p => p.EnterpriseId);
            entity.HasIndex(p => new { p.Latitude, p.Longitude });
        });

        // OcopProductImage Configuration
        modelBuilder.Entity<OcopProductImage>(entity =>
        {
            entity.ToTable("OcopProductImages", schema: "PRODUCTS");
            entity.HasKey(i => i.Id);

            entity.Property(i => i.Id)
                .ValueGeneratedOnAdd();

            entity.Property(i => i.PublicId)
                .HasDefaultValueSql("NEWSEQUENTIALID()");

            entity.Property(i => i.ImageUrl)
                .IsRequired()
                .HasMaxLength(500);

            entity.Property(i => i.ImagePublicId);

            entity.Property(i => i.DisplayOrder)
                .HasDefaultValue(0);

            entity.Property(i => i.IsPrimary)
                .HasDefaultValue(false);

            entity.Property(i => i.Caption)
                .HasMaxLength(255);

            entity.Property(i => i.CreatedAt)
                .HasDefaultValueSql("GETUTCDATE()");

            // Foreign Key
            entity.HasOne(i => i.Product)
                .WithMany(p => p.Images)
                .HasForeignKey(i => i.ProductId)
                .OnDelete(DeleteBehavior.Cascade);

            // Indexes
            entity.HasIndex(i => i.PublicId).IsUnique();
            entity.HasIndex(i => i.ProductId);
            entity.HasIndex(i => new { i.ProductId, i.DisplayOrder });
        });

        // OcopEnterpriseDocument Configuration
        modelBuilder.Entity<OcopEnterpriseDocument>(entity =>
        {
            entity.ToTable("OcopEnterpriseDocuments", schema: "PRODUCTS");
            entity.HasKey(d => d.Id);

            entity.Property(d => d.Id)
                .ValueGeneratedOnAdd();

            entity.Property(d => d.PublicId)
                .HasDefaultValueSql("NEWSEQUENTIALID()");

            entity.Property(d => d.DocumentUrl)
                .IsRequired()
                .HasMaxLength(500);

            entity.Property(d => d.DocumentName)
                .IsRequired()
                .HasMaxLength(255);

            entity.Property(d => d.Description)
                .HasMaxLength(500);

            entity.Property(d => d.DisplayOrder)
                .HasDefaultValue(0);

            entity.Property(d => d.IsActive)
                .HasDefaultValue(true);

            entity.Property(d => d.CreatedAt)
                .HasDefaultValueSql("GETUTCDATE()");

            // Foreign Key
            entity.HasOne(d => d.Enterprise)
                .WithMany(e => e.Documents)
                .HasForeignKey(d => d.EnterpriseId)
                .OnDelete(DeleteBehavior.Cascade);

            // Indexes
            entity.HasIndex(d => d.PublicId).IsUnique();
            entity.HasIndex(d => d.EnterpriseId);
            entity.HasIndex(d => new { d.EnterpriseId, d.DisplayOrder });
        });
    }

    private static void ConfigureKhaoSatSchema(ModelBuilder modelBuilder)
    {
        modelBuilder.Entity<Survey>(entity =>
        {
            entity.ToTable("KhaoSats", schema: "KHAOSAT");
            entity.HasKey(s => s.Id);
            entity.Property(s => s.Id).ValueGeneratedOnAdd();
            entity.Property(s => s.TenKhaoSat).HasMaxLength(255).IsRequired();
            entity.Property(s => s.DisplayWebsite).HasMaxLength(500);
            entity.Property(s => s.Header).HasMaxLength(1000);
            entity.Property(s => s.Footer).HasMaxLength(1000);
            entity.Property(s => s.VeViec).HasMaxLength(1000);
            entity.Property(s => s.IsActive).HasDefaultValue(true);
            entity.Property(s => s.CreatedAt).HasDefaultValueSql("GETUTCDATE()");
            entity.Property(s => s.UpdatedAt).HasDefaultValueSql("GETUTCDATE()");
        });

        modelBuilder.Entity<Question>(entity =>
        {
            entity.ToTable("CauHois", schema: "KHAOSAT");
            entity.HasKey(q => q.Id);
            entity.Property(q => q.Id).ValueGeneratedOnAdd();
            entity.Property(q => q.NoiDung).HasColumnType("nvarchar(max)").IsRequired();
            entity.Property(q => q.CauHoiTuLuan).HasColumnType("nvarchar(max)");
            entity.Property(q => q.STT);

            entity.HasOne(q => q.Survey)
                .WithMany(s => s.Questions)
                .HasForeignKey(q => q.SurveyId)
                .OnDelete(DeleteBehavior.Cascade);

            entity.HasIndex(q => q.SurveyId);
        });

        modelBuilder.Entity<Answer>(entity =>
        {
            entity.ToTable("TraLois", schema: "KHAOSAT");
            entity.HasKey(a => a.Id);
            entity.Property(a => a.Id).ValueGeneratedOnAdd();
            entity.Property(a => a.TraLoi).HasColumnType("nvarchar(max)").IsRequired();

            entity.HasOne(a => a.Question)
                .WithMany(q => q.Answers)
                .HasForeignKey(a => a.QuestionId)
                .OnDelete(DeleteBehavior.Cascade);

            entity.HasIndex(a => a.QuestionId);
        });

        modelBuilder.Entity<EssayQuestion>(entity =>
        {
            entity.ToTable("TuLuans", schema: "KHAOSAT");
            entity.HasKey(t => t.Id);
            entity.Property(t => t.Id).ValueGeneratedOnAdd();
            entity.Property(t => t.CauHoiTuLuan).HasColumnType("nvarchar(max)").IsRequired();

            entity.HasOne(t => t.Survey)
                .WithMany(s => s.EssayQuestions)
                .HasForeignKey(t => t.SurveyId)
                .OnDelete(DeleteBehavior.Cascade);

            entity.HasIndex(t => t.SurveyId);
        });

        modelBuilder.Entity<OtherOpinion>(entity =>
        {
            entity.ToTable("YKienKhacs", schema: "KHAOSAT");
            entity.HasKey(y => y.Id);
            entity.Property(y => y.Id).ValueGeneratedOnAdd();
            entity.Property(y => y.UserID).HasMaxLength(100).IsRequired();
            entity.Property(y => y.YKienKhac).HasColumnType("nvarchar(max)").IsRequired();
            entity.Property(y => y.CreatedAt).HasDefaultValueSql("GETUTCDATE()");

            entity.HasOne(y => y.Survey)
                .WithMany(s => s.OtherOpinions)
                .HasForeignKey(y => y.SurveyId)
                .OnDelete(DeleteBehavior.Cascade);

            entity.HasIndex(y => y.SurveyId);
            entity.HasIndex(y => y.UserID);
        });

        modelBuilder.Entity<SurveyResponse>(entity =>
        {
            entity.ToTable("Responses", schema: "KHAOSAT");
            entity.HasKey(r => r.Id);
            entity.Property(r => r.Id).ValueGeneratedOnAdd();
            entity.Property(r => r.HoTen).HasMaxLength(255);
            entity.Property(r => r.DiaChi).HasMaxLength(500);
            entity.Property(r => r.CreatedAt).HasDefaultValueSql("GETUTCDATE()");

            entity.HasOne(r => r.Survey)
                .WithMany(s => s.Responses)
                .HasForeignKey(r => r.SurveyId)
                .OnDelete(DeleteBehavior.Cascade);

            entity.HasOne(r => r.Question)
                .WithMany()
                .HasForeignKey(r => r.QuestionId)
                .OnDelete(DeleteBehavior.NoAction);

            entity.HasOne(r => r.Answer)
                .WithMany()
                .HasForeignKey(r => r.AnswerId)
                .OnDelete(DeleteBehavior.NoAction);

            entity.HasIndex(r => new { r.SurveyId, r.IDUser });
            entity.HasIndex(r => r.QuestionId);
            entity.HasIndex(r => r.AnswerId);
        });

        modelBuilder.Entity<EssayResponse>(entity =>
        {
            entity.ToTable("EssayResponses", schema: "KHAOSAT");
            entity.HasKey(r => r.Id);
            entity.Property(r => r.Id).ValueGeneratedOnAdd();
            entity.Property(r => r.Content).HasColumnType("nvarchar(max)").IsRequired();
            entity.Property(r => r.CreatedAt).HasDefaultValueSql("GETUTCDATE()");

            entity.HasOne<Survey>()
                .WithMany()
                .HasForeignKey(r => r.SurveyId)
                .OnDelete(DeleteBehavior.Cascade);

            entity.HasOne<EssayQuestion>()
                .WithMany()
                .HasForeignKey(r => r.EssayQuestionId)
                .OnDelete(DeleteBehavior.NoAction);

            entity.HasIndex(r => new { r.SurveyId, r.IDUser });
            entity.HasIndex(r => r.EssayQuestionId);
        });
    }

    private static void ConfigureNewsSchema(ModelBuilder modelBuilder)
    {
        modelBuilder.Entity<Article>(entity =>
        {
            entity.ToTable("Articles", schema: "NEWS");
            entity.HasKey(a => a.Id);
            entity.Property(a => a.PublicId).HasDefaultValueSql("NEWSEQUENTIALID()");
            entity.HasIndex(a => a.PublicId).IsUnique();
            entity.Property(a => a.Title).IsRequired().HasMaxLength(500);
            entity.Property(a => a.Slug).HasMaxLength(500);
            entity.Property(a => a.Summary).HasMaxLength(1000);
            entity.Property(a => a.Content).HasColumnType("nvarchar(max)");
            entity.Property(a => a.CoverImagePublicId).HasMaxLength(200);
            entity.Property(a => a.AuthorName).HasMaxLength(200);
            entity.Property(a => a.IsActive).HasDefaultValue(true);
            entity.Property(a => a.CreatedAt).HasDefaultValueSql("GETUTCDATE()");
            entity.Property(a => a.UpdatedAt).HasDefaultValueSql("GETUTCDATE()");
        });
    }

    private static void ConfigureBookingSchema(ModelBuilder modelBuilder)
    {
        modelBuilder.Entity<Tour>(entity =>
        {
            entity.ToTable("Tours", schema: "BOOKING");
            entity.HasKey(t => t.Id);
            entity.Property(t => t.PublicId).HasDefaultValueSql("NEWSEQUENTIALID()");
            entity.HasIndex(t => t.PublicId).IsUnique();
            entity.Property(t => t.Name).IsRequired().HasMaxLength(500);
            entity.Property(t => t.Description).HasColumnType("nvarchar(max)");
            entity.Property(t => t.Price).HasColumnType("decimal(18,2)");
            entity.Property(t => t.IsActive).HasDefaultValue(true);
            entity.Property(t => t.CreatedAt).HasDefaultValueSql("GETUTCDATE()");
            entity.Property(t => t.UpdatedAt).HasDefaultValueSql("GETUTCDATE()");
        });

        modelBuilder.Entity<TourImage>(entity =>
        {
            entity.ToTable("TourImages", schema: "BOOKING");
            entity.HasKey(t => t.Id);
            entity.Property(t => t.PublicId).HasDefaultValueSql("NEWSEQUENTIALID()");
            entity.Property(t => t.ImageUrl).IsRequired().HasMaxLength(500);
            entity.Property(t => t.ImagePublicId).IsRequired();
            entity.Property(t => t.CreatedAt).HasDefaultValueSql("GETUTCDATE()");
            entity.HasOne(t => t.Tour).WithMany(t => t.Images).HasForeignKey(t => t.TourId).OnDelete(DeleteBehavior.Cascade);
        });

        modelBuilder.Entity<Ticket>(entity =>
        {
            entity.ToTable("Tickets", schema: "BOOKING");
            entity.HasKey(t => t.Id);
            entity.Property(t => t.PublicId).HasDefaultValueSql("NEWSEQUENTIALID()");
            entity.HasIndex(t => t.PublicId).IsUnique();
            entity.Property(t => t.Name).IsRequired().HasMaxLength(500);
            entity.Property(t => t.Price).HasColumnType("decimal(18,2)");
            entity.Property(t => t.IsActive).HasDefaultValue(true);
            entity.Property(t => t.CreatedAt).HasDefaultValueSql("GETUTCDATE()");
            entity.Property(t => t.UpdatedAt).HasDefaultValueSql("GETUTCDATE()");
        });

        modelBuilder.Entity<BookingOrder>(entity =>
        {
            entity.ToTable("BookingOrders", schema: "BOOKING");
            entity.HasKey(b => b.Id);
            entity.Property(b => b.PublicId).HasDefaultValueSql("NEWSEQUENTIALID()");
            entity.HasIndex(b => b.PublicId).IsUnique();
            entity.Property(b => b.BookingCode).HasMaxLength(50);
            entity.Property(b => b.CustomerName).HasMaxLength(200);
            entity.Property(b => b.PhoneNumber).HasMaxLength(20);
            entity.Property(b => b.TotalAmount).HasColumnType("decimal(18,2)");
            entity.Property(b => b.CreatedAt).HasDefaultValueSql("GETUTCDATE()");
            entity.Property(b => b.UpdatedAt).HasDefaultValueSql("GETUTCDATE()");
            
            entity.HasOne(b => b.Tour).WithMany().HasForeignKey(b => b.TourId).OnDelete(DeleteBehavior.SetNull);
            entity.HasOne(b => b.Ticket).WithMany().HasForeignKey(b => b.TicketId).OnDelete(DeleteBehavior.SetNull);
        });
    }

    private static void ConfigurePaymentSchema(ModelBuilder modelBuilder)
    {
        modelBuilder.Entity<PaymentTransaction>(entity =>
        {
            entity.ToTable("PaymentTransactions", schema: "PAYMENT");
            entity.HasKey(p => p.Id);
            entity.Property(p => p.PublicId).HasDefaultValueSql("NEWSEQUENTIALID()");
            entity.HasIndex(p => p.PublicId).IsUnique();
            entity.Property(p => p.Amount).HasColumnType("decimal(18,2)");
            entity.Property(p => p.CreatedAt).HasDefaultValueSql("GETUTCDATE()");
            entity.Property(p => p.UpdatedAt).HasDefaultValueSql("GETUTCDATE()");
            
            entity.HasOne(p => p.BookingOrder).WithMany().HasForeignKey(p => p.BookingOrderId).OnDelete(DeleteBehavior.Cascade);
        });
    }
}
