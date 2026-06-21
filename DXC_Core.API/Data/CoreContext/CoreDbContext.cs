using DXC_Core.API.Data.CoreContext.Models.Identity;
using DXC_Core.API.Data.CoreContext.Models.Profile;
using DXC_Core.API.Data.CoreContext.Models.Common;
using Microsoft.EntityFrameworkCore;

namespace DXC_Core.API.Data.CoreContext;

public class CoreDbContext : DbContext
{
    public CoreDbContext(DbContextOptions<CoreDbContext> options) : base(options) { }

    // DbSets đã có
    public DbSet<User> Users { get; set; }

    // DbSets mới
    public DbSet<Role> Roles { get; set; }
    public DbSet<UserRole> UserRoles { get; set; }

    // DbSets cho Profile schema
    public DbSet<UserProfile> UserProfiles { get; set; }

    // DbSets cho Common schema
    public DbSet<Organization> Organizations { get; set; }
    public DbSet<Department> Departments { get; set; }
    public DbSet<UserDepartment> UserDepartments { get; set; }

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        base.OnModelCreating(modelBuilder);

        modelBuilder.Entity<User>(entity =>
        {
            entity.ToTable("Users", schema: "IDENTITY");
            
            // Cấu hình cho PublicId
            entity.Property(u => u.PublicId)
                  .HasDefaultValueSql("NEWSEQUENTIALID()"); // Tối ưu cho SQL Server
            
            entity.HasIndex(u => u.PublicId)
                  .IsUnique(); // Tạo unique index cho PublicId
            
            entity.HasIndex(u => u.UserName).IsUnique();
            entity.HasIndex(u => u.Email).IsUnique();
        });

        // Cấu hình mới cho Role
        modelBuilder.Entity<Role>(entity =>
        {
            entity.ToTable("Roles", schema: "IDENTITY");
            entity.Property(r => r.PublicId)
                  .HasDefaultValueSql("NEWSEQUENTIALID()");
            entity.HasIndex(r => r.PublicId)
                  .IsUnique();
            entity.HasIndex(r => r.Name).IsUnique();
            entity.HasIndex(r => r.Code).IsUnique(); 
        });

        // Cấu hình mới cho bảng trung gian UserRole (quan hệ nhiều-nhiều)
        modelBuilder.Entity<UserRole>(entity =>
        {
            entity.ToTable("UserRoles", schema: "IDENTITY");
            entity.HasKey(ur => new { ur.UserId, ur.RoleId }); // Khóa chính kết hợp

            entity.HasOne(ur => ur.User)
                .WithMany() // Nếu không cần navigation property list trong User
                .HasForeignKey(ur => ur.UserId);

            entity.HasOne(ur => ur.Role)
                .WithMany() // Nếu không cần navigation property list trong Role
                .HasForeignKey(ur => ur.RoleId);
        });

        // Cấu hình cho UserProfile
        modelBuilder.Entity<UserProfile>(entity =>
        {
            entity.ToTable("UserProfiles", "PROFILE");
            entity.Property(u => u.PublicId)
                  .HasDefaultValueSql("NEWID()");
            
            entity.HasIndex(u => u.PublicId).IsUnique();
            entity.HasIndex(u => u.UserId).IsUnique();
            
            entity.HasOne(up => up.User)
                  .WithOne() // 1-1 relationship
                  .HasForeignKey<UserProfile>(up => up.UserId)
                  .OnDelete(DeleteBehavior.Cascade);
        });

        // Cấu hình cho Organization
        modelBuilder.Entity<Organization>(entity =>
        {
            entity.ToTable("Organizations", "COMMON");
            entity.Property(o => o.PublicId)
                  .HasDefaultValueSql("NEWID()");
            
            entity.HasIndex(o => o.PublicId).IsUnique();
            entity.HasIndex(o => o.Code).IsUnique();
        });

        // Cấu hình cho Department
        modelBuilder.Entity<Department>(entity =>
        {
            entity.ToTable("Departments", "COMMON");
            entity.Property(d => d.PublicId)
                  .HasDefaultValueSql("NEWID()");
            
            entity.HasIndex(d => d.PublicId).IsUnique();
            entity.HasIndex(d => new { d.OrganizationId, d.Code }).IsUnique();
            
            entity.HasOne(d => d.Organization)
                  .WithMany(o => o.Departments)
                  .HasForeignKey(d => d.OrganizationId)
                  .OnDelete(DeleteBehavior.Cascade);
        });

        // Cấu hình cho UserDepartment (quan hệ nhiều-nhiều)
        modelBuilder.Entity<UserDepartment>(entity =>
        {
            entity.ToTable("UserDepartments", "COMMON");
            entity.HasKey(ud => new { ud.UserId, ud.DepartmentId }); // Khóa chính kết hợp

            entity.HasOne(ud => ud.User)
                .WithMany()
                .HasForeignKey(ud => ud.UserId)
                .OnDelete(DeleteBehavior.Cascade);

            entity.HasOne(ud => ud.Department)
                .WithMany()
                .HasForeignKey(ud => ud.DepartmentId)
                .OnDelete(DeleteBehavior.Cascade);
        });
    }
}