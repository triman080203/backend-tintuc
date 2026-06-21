using DXC_Core.API.Data.FileContext.Models;
using Microsoft.EntityFrameworkCore;
using FileModel = DXC_Core.API.Data.FileContext.Models.File;

namespace DXC_Core.API.Data.FileContext;

public class FileDbContext : DbContext
{
    public FileDbContext(DbContextOptions<FileDbContext> options) : base(options) { }

    public DbSet<FileModel> Files { get; set; }

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        base.OnModelCreating(modelBuilder);

        modelBuilder.Entity<FileModel>(entity =>
        {
            entity.ToTable("Files", schema: "FILES");

            entity.Property(f => f.PublicId)
                  .HasDefaultValueSql("NEWSEQUENTIALID()");

            entity.HasIndex(f => f.PublicId)
                  .IsUnique();
            
            // Cấu hình các thuộc tính
            entity.Property(f => f.FileName)
                  .HasMaxLength(255)
                  .IsRequired();
                  
            entity.Property(f => f.StoredFileName)
                  .HasMaxLength(255)
                  .IsRequired();
                  
            entity.Property(f => f.FilePath)
                  .HasMaxLength(500)
                  .IsRequired();
                  
            entity.Property(f => f.ContentType)
                  .HasMaxLength(100)
                  .IsRequired();
                  
            entity.Property(f => f.EntityType)
                  .HasMaxLength(100);
                  
            entity.Property(f => f.Description)
                  .HasMaxLength(500);
                  
            entity.Property(f => f.UploadedAt)
                  .HasDefaultValueSql("GETUTCDATE()");
                  
            // Tạo index cho các trường thường được query
            entity.HasIndex(f => new { f.EntityId, f.EntityType });
            entity.HasIndex(f => f.UploadedById);
            entity.HasIndex(f => f.UploadedAt);

            entity.HasIndex(f => new { f.EntityPublicId, f.EntityType });
        });
    }
}