IF OBJECT_ID(N'[__EFMigrationsHistory]') IS NULL
BEGIN
    CREATE TABLE [__EFMigrationsHistory] (
        [MigrationId] nvarchar(150) NOT NULL,
        [ProductVersion] nvarchar(32) NOT NULL,
        CONSTRAINT [PK___EFMigrationsHistory] PRIMARY KEY ([MigrationId])
    );
END;
GO

BEGIN TRANSACTION;
GO

IF SCHEMA_ID(N'PLACES') IS NULL EXEC(N'CREATE SCHEMA [PLACES];');
GO

CREATE TABLE [PLACES].[Hotels] (
    [Id] int NOT NULL IDENTITY,
    [PublicId] uniqueidentifier NOT NULL DEFAULT (NEWSEQUENTIALID()),
    [Name] nvarchar(255) NOT NULL,
    [Description] nvarchar(max) NULL,
    [Address] nvarchar(500) NULL,
    [StarRating] int NULL,
    [PhoneNumber] nvarchar(20) NULL,
    [Email] nvarchar(100) NULL,
    [Website] nvarchar(255) NULL,
    [OperatingHours] nvarchar(100) NULL,
    [Latitude] decimal(10,8) NULL,
    [Longitude] decimal(11,8) NULL,
    [VR360Link] nvarchar(500) NULL,
    [TenantId] int NOT NULL,
    [IsActive] bit NOT NULL DEFAULT CAST(1 AS bit),
    [CreatedAt] datetime2 NOT NULL DEFAULT (GETUTCDATE()),
    [UpdatedAt] datetime2 NOT NULL DEFAULT (GETUTCDATE()),
    CONSTRAINT [PK_Hotels] PRIMARY KEY ([Id])
);
GO

CREATE TABLE [PLACES].[HotelImages] (
    [Id] int NOT NULL IDENTITY,
    [HotelId] int NOT NULL,
    [ImageUrl] nvarchar(500) NOT NULL,
    [DisplayOrder] int NOT NULL DEFAULT 0,
    [IsPrimary] bit NOT NULL DEFAULT CAST(0 AS bit),
    [Caption] nvarchar(255) NULL,
    [TenantId] int NOT NULL,
    [CreatedAt] datetime2 NOT NULL DEFAULT (GETUTCDATE()),
    CONSTRAINT [PK_HotelImages] PRIMARY KEY ([Id]),
    CONSTRAINT [FK_HotelImages_Hotels_HotelId] FOREIGN KEY ([HotelId]) REFERENCES [PLACES].[Hotels] ([Id]) ON DELETE CASCADE
);
GO

CREATE INDEX [IX_HotelImages_HotelId] ON [PLACES].[HotelImages] ([HotelId]);
GO

CREATE INDEX [IX_HotelImages_HotelId_DisplayOrder] ON [PLACES].[HotelImages] ([HotelId], [DisplayOrder]);
GO

CREATE INDEX [IX_HotelImages_TenantId] ON [PLACES].[HotelImages] ([TenantId]);
GO

CREATE UNIQUE INDEX [IX_Hotels_PublicId] ON [PLACES].[Hotels] ([PublicId]);
GO

CREATE INDEX [IX_Hotels_TenantId] ON [PLACES].[Hotels] ([TenantId]);
GO

CREATE INDEX [IX_Hotels_TenantId_IsActive] ON [PLACES].[Hotels] ([TenantId], [IsActive]);
GO

INSERT INTO [__EFMigrationsHistory] ([MigrationId], [ProductVersion])
VALUES (N'20250917035618_InitialCreate_ZaloMiniApp', N'8.0.0');
GO

COMMIT;
GO

BEGIN TRANSACTION;
GO

DROP INDEX [IX_Hotels_TenantId] ON [PLACES].[Hotels];
GO

DROP INDEX [IX_Hotels_TenantId_IsActive] ON [PLACES].[Hotels];
GO

DROP INDEX [IX_HotelImages_TenantId] ON [PLACES].[HotelImages];
GO

DECLARE @var0 sysname;
SELECT @var0 = [d].[name]
FROM [sys].[default_constraints] [d]
INNER JOIN [sys].[columns] [c] ON [d].[parent_column_id] = [c].[column_id] AND [d].[parent_object_id] = [c].[object_id]
WHERE ([d].[parent_object_id] = OBJECT_ID(N'[PLACES].[Hotels]') AND [c].[name] = N'TenantId');
IF @var0 IS NOT NULL EXEC(N'ALTER TABLE [PLACES].[Hotels] DROP CONSTRAINT [' + @var0 + '];');
ALTER TABLE [PLACES].[Hotels] DROP COLUMN [TenantId];
GO

DECLARE @var1 sysname;
SELECT @var1 = [d].[name]
FROM [sys].[default_constraints] [d]
INNER JOIN [sys].[columns] [c] ON [d].[parent_column_id] = [c].[column_id] AND [d].[parent_object_id] = [c].[object_id]
WHERE ([d].[parent_object_id] = OBJECT_ID(N'[PLACES].[HotelImages]') AND [c].[name] = N'TenantId');
IF @var1 IS NOT NULL EXEC(N'ALTER TABLE [PLACES].[HotelImages] DROP CONSTRAINT [' + @var1 + '];');
ALTER TABLE [PLACES].[HotelImages] DROP COLUMN [TenantId];
GO

ALTER TABLE [PLACES].[HotelImages] ADD [HotelId1] int NULL;
GO

CREATE INDEX [IX_HotelImages_HotelId1] ON [PLACES].[HotelImages] ([HotelId1]);
GO

ALTER TABLE [PLACES].[HotelImages] ADD CONSTRAINT [FK_HotelImages_Hotels_HotelId1] FOREIGN KEY ([HotelId1]) REFERENCES [PLACES].[Hotels] ([Id]);
GO

INSERT INTO [__EFMigrationsHistory] ([MigrationId], [ProductVersion])
VALUES (N'20250917043614_RemoveTenantIdFromZaloMiniApp', N'8.0.0');
GO

COMMIT;
GO

BEGIN TRANSACTION;
GO

ALTER TABLE [PLACES].[HotelImages] DROP CONSTRAINT [FK_HotelImages_Hotels_HotelId1];
GO

DROP INDEX [IX_HotelImages_HotelId1] ON [PLACES].[HotelImages];
GO

DECLARE @var2 sysname;
SELECT @var2 = [d].[name]
FROM [sys].[default_constraints] [d]
INNER JOIN [sys].[columns] [c] ON [d].[parent_column_id] = [c].[column_id] AND [d].[parent_object_id] = [c].[object_id]
WHERE ([d].[parent_object_id] = OBJECT_ID(N'[PLACES].[HotelImages]') AND [c].[name] = N'HotelId1');
IF @var2 IS NOT NULL EXEC(N'ALTER TABLE [PLACES].[HotelImages] DROP CONSTRAINT [' + @var2 + '];');
ALTER TABLE [PLACES].[HotelImages] DROP COLUMN [HotelId1];
GO

INSERT INTO [__EFMigrationsHistory] ([MigrationId], [ProductVersion])
VALUES (N'20250917043634_FixHotelImageForeignKey', N'8.0.0');
GO

COMMIT;
GO

BEGIN TRANSACTION;
GO

ALTER TABLE [PLACES].[Hotels] ADD [PriceFrom] decimal(18,2) NULL;
GO

ALTER TABLE [PLACES].[Hotels] ADD [PriceFromCurrency] nvarchar(10) NULL;
GO

INSERT INTO [__EFMigrationsHistory] ([MigrationId], [ProductVersion])
VALUES (N'20250917045028_AddMissingHotelFields', N'8.0.0');
GO

COMMIT;
GO

BEGIN TRANSACTION;
GO

ALTER TABLE [PLACES].[HotelImages] ADD [PublicId] uniqueidentifier NOT NULL DEFAULT (NEWSEQUENTIALID());
GO

CREATE UNIQUE INDEX [IX_HotelImages_PublicId] ON [PLACES].[HotelImages] ([PublicId]);
GO

INSERT INTO [__EFMigrationsHistory] ([MigrationId], [ProductVersion])
VALUES (N'20250917153408_AddPublicIdToHotelImages', N'8.0.0');
GO

COMMIT;
GO

BEGIN TRANSACTION;
GO

CREATE TABLE [PLACES].[Restaurants] (
    [Id] int NOT NULL IDENTITY,
    [PublicId] uniqueidentifier NOT NULL DEFAULT (NEWSEQUENTIALID()),
    [Name] nvarchar(255) NOT NULL,
    [Description] nvarchar(max) NULL,
    [Address] nvarchar(500) NULL,
    [PhoneNumber] nvarchar(20) NULL,
    [OperatingHours] nvarchar(100) NULL,
    [Schedule] nvarchar(max) NULL,
    [Latitude] decimal(10,8) NULL,
    [Longitude] decimal(11,8) NULL,
    [VR360Link] nvarchar(500) NULL,
    [Category] nvarchar(100) NULL,
    [AveragePriceRange] nvarchar(50) NULL,
    [IsActive] bit NOT NULL DEFAULT CAST(1 AS bit),
    [CreatedAt] datetime2 NOT NULL DEFAULT (GETUTCDATE()),
    [UpdatedAt] datetime2 NOT NULL DEFAULT (GETUTCDATE()),
    CONSTRAINT [PK_Restaurants] PRIMARY KEY ([Id])
);
GO

CREATE TABLE [PLACES].[RestaurantImages] (
    [Id] int NOT NULL IDENTITY,
    [PublicId] uniqueidentifier NOT NULL DEFAULT (NEWSEQUENTIALID()),
    [RestaurantId] int NOT NULL,
    [ImageUrl] nvarchar(500) NOT NULL,
    [DisplayOrder] int NOT NULL DEFAULT 0,
    [IsPrimary] bit NOT NULL DEFAULT CAST(0 AS bit),
    [Caption] nvarchar(255) NULL,
    [CreatedAt] datetime2 NOT NULL DEFAULT (GETUTCDATE()),
    CONSTRAINT [PK_RestaurantImages] PRIMARY KEY ([Id]),
    CONSTRAINT [FK_RestaurantImages_Restaurants_RestaurantId] FOREIGN KEY ([RestaurantId]) REFERENCES [PLACES].[Restaurants] ([Id]) ON DELETE CASCADE
);
GO

CREATE UNIQUE INDEX [IX_Restaurants_PublicId] ON [PLACES].[Restaurants] ([PublicId]);
GO

CREATE UNIQUE INDEX [IX_RestaurantImages_PublicId] ON [PLACES].[RestaurantImages] ([PublicId]);
GO

CREATE INDEX [IX_RestaurantImages_RestaurantId] ON [PLACES].[RestaurantImages] ([RestaurantId]);
GO

CREATE INDEX [IX_RestaurantImages_RestaurantId_DisplayOrder] ON [PLACES].[RestaurantImages] ([RestaurantId], [DisplayOrder]);
GO

INSERT INTO [__EFMigrationsHistory] ([MigrationId], [ProductVersion])
VALUES (N'20250920052400_AddRestaurantsTable', N'8.0.0');
GO

COMMIT;
GO

BEGIN TRANSACTION;
GO

CREATE TABLE [PLACES].[Homestays] (
    [Id] int NOT NULL IDENTITY,
    [PublicId] uniqueidentifier NOT NULL DEFAULT (NEWSEQUENTIALID()),
    [Name] nvarchar(255) NOT NULL,
    [Description] nvarchar(max) NULL,
    [Address] nvarchar(500) NULL,
    [PhoneNumber] nvarchar(20) NULL,
    [AveragePrice] decimal(18,2) NULL,
    [AveragePriceCurrency] nvarchar(10) NULL,
    [Latitude] decimal(10,8) NULL,
    [Longitude] decimal(11,8) NULL,
    [IsActive] bit NOT NULL DEFAULT CAST(1 AS bit),
    [CreatedAt] datetime2 NOT NULL DEFAULT (GETUTCDATE()),
    [UpdatedAt] datetime2 NOT NULL DEFAULT (GETUTCDATE()),
    CONSTRAINT [PK_Homestays] PRIMARY KEY ([Id])
);
GO

CREATE TABLE [PLACES].[HomestayImages] (
    [Id] int NOT NULL IDENTITY,
    [PublicId] uniqueidentifier NOT NULL DEFAULT (NEWSEQUENTIALID()),
    [HomestayId] int NOT NULL,
    [ImageUrl] nvarchar(500) NOT NULL,
    [DisplayOrder] int NOT NULL DEFAULT 0,
    [IsPrimary] bit NOT NULL DEFAULT CAST(0 AS bit),
    [Caption] nvarchar(255) NULL,
    [CreatedAt] datetime2 NOT NULL DEFAULT (GETUTCDATE()),
    CONSTRAINT [PK_HomestayImages] PRIMARY KEY ([Id]),
    CONSTRAINT [FK_HomestayImages_Homestays_HomestayId] FOREIGN KEY ([HomestayId]) REFERENCES [PLACES].[Homestays] ([Id]) ON DELETE CASCADE
);
GO

CREATE UNIQUE INDEX [IX_Homestays_PublicId] ON [PLACES].[Homestays] ([PublicId]);
GO

CREATE UNIQUE INDEX [IX_HomestayImages_PublicId] ON [PLACES].[HomestayImages] ([PublicId]);
GO

CREATE INDEX [IX_HomestayImages_HomestayId] ON [PLACES].[HomestayImages] ([HomestayId]);
GO

CREATE INDEX [IX_HomestayImages_HomestayId_DisplayOrder] ON [PLACES].[HomestayImages] ([HomestayId], [DisplayOrder]);
GO

INSERT INTO [__EFMigrationsHistory] ([MigrationId], [ProductVersion])
VALUES (N'20250920055800_AddHomestaysTable', N'8.0.0');
GO

COMMIT;
GO

BEGIN TRANSACTION;
GO

IF SCHEMA_ID(N'SERVICES') IS NULL EXEC(N'CREATE SCHEMA [SERVICES];');
GO

CREATE TABLE [SERVICES].[HotlineCategories] (
    [Id] int NOT NULL IDENTITY,
    [PublicId] uniqueidentifier NOT NULL DEFAULT (NEWSEQUENTIALID()),
    [Name] nvarchar(255) NOT NULL,
    [Description] nvarchar(1000) NULL,
    [IsActive] bit NOT NULL DEFAULT CAST(1 AS bit),
    [CreatedAt] datetime2 NOT NULL DEFAULT (GETUTCDATE()),
    [UpdatedAt] datetime2 NOT NULL DEFAULT (GETUTCDATE()),
    CONSTRAINT [PK_HotlineCategories] PRIMARY KEY ([Id])
);
GO

CREATE TABLE [SERVICES].[Hotlines] (
    [Id] int NOT NULL IDENTITY,
    [PublicId] uniqueidentifier NOT NULL DEFAULT (NEWSEQUENTIALID()),
    [CategoryId] int NOT NULL,
    [PhoneNumber] nvarchar(20) NOT NULL,
    [ContactName] nvarchar(255) NOT NULL,
    [Description] nvarchar(500) NULL,
    [IsActive] bit NOT NULL DEFAULT CAST(1 AS bit),
    [CreatedAt] datetime2 NOT NULL DEFAULT (GETUTCDATE()),
    [UpdatedAt] datetime2 NOT NULL DEFAULT (GETUTCDATE()),
    CONSTRAINT [PK_Hotlines] PRIMARY KEY ([Id]),
    CONSTRAINT [FK_Hotlines_HotlineCategories_CategoryId] FOREIGN KEY ([CategoryId]) REFERENCES [SERVICES].[HotlineCategories] ([Id]) ON DELETE CASCADE
);
GO

CREATE UNIQUE INDEX [IX_HotlineCategories_Name] ON [SERVICES].[HotlineCategories] ([Name]);
GO

CREATE UNIQUE INDEX [IX_HotlineCategories_PublicId] ON [SERVICES].[HotlineCategories] ([PublicId]);
GO

CREATE INDEX [IX_Hotlines_CategoryId] ON [SERVICES].[Hotlines] ([CategoryId]);
GO

CREATE UNIQUE INDEX [IX_Hotlines_PublicId] ON [SERVICES].[Hotlines] ([PublicId]);
GO

INSERT INTO [__EFMigrationsHistory] ([MigrationId], [ProductVersion])
VALUES (N'20250920143713_AddHotlinesOnly', N'8.0.0');
GO

COMMIT;
GO

BEGIN TRANSACTION;
GO

CREATE TABLE [SERVICES].[IconCategories] (
    [Id] int NOT NULL IDENTITY,
    [PublicId] uniqueidentifier NOT NULL DEFAULT (NEWSEQUENTIALID()),
    [Name] nvarchar(100) NOT NULL,
    [Description] nvarchar(500) NULL,
    [DisplayOrder] int NOT NULL DEFAULT 0,
    [IsActive] bit NOT NULL DEFAULT CAST(1 AS bit),
    [CreatedAt] datetime2 NOT NULL DEFAULT (GETUTCDATE()),
    [UpdatedAt] datetime2 NOT NULL DEFAULT (GETUTCDATE()),
    CONSTRAINT [PK_IconCategories] PRIMARY KEY ([Id])
);
GO

CREATE TABLE [SERVICES].[IconGroups] (
    [Id] int NOT NULL IDENTITY,
    [PublicId] uniqueidentifier NOT NULL DEFAULT (NEWSEQUENTIALID()),
    [IconCategoryId] int NOT NULL,
    [Name] nvarchar(100) NOT NULL,
    [Description] nvarchar(500) NULL,
    [DisplayOrder] int NOT NULL DEFAULT 0,
    [IsActive] bit NOT NULL DEFAULT CAST(1 AS bit),
    [CreatedAt] datetime2 NOT NULL DEFAULT (GETUTCDATE()),
    [UpdatedAt] datetime2 NOT NULL DEFAULT (GETUTCDATE()),
    CONSTRAINT [PK_IconGroups] PRIMARY KEY ([Id]),
    CONSTRAINT [FK_IconGroups_IconCategories_IconCategoryId] FOREIGN KEY ([IconCategoryId]) REFERENCES [SERVICES].[IconCategories] ([Id]) ON DELETE CASCADE
);
GO

CREATE TABLE [SERVICES].[Icons] (
    [Id] int NOT NULL IDENTITY,
    [PublicId] uniqueidentifier NOT NULL DEFAULT (NEWSEQUENTIALID()),
    [IconCategoryId] int NULL,
    [IconGroupId] int NULL,
    [Name] nvarchar(100) NOT NULL,
    [Description] nvarchar(500) NULL,
    [IconImageUrl] nvarchar(500) NOT NULL,
    [IconType] nvarchar(20) NOT NULL,
    [ScreenParams] nvarchar(1000) NULL,
    [WebLink] nvarchar(500) NULL,
    [DisplayOrder] int NOT NULL DEFAULT 0,
    [IsActive] bit NOT NULL DEFAULT CAST(1 AS bit),
    [CreatedAt] datetime2 NOT NULL DEFAULT (GETUTCDATE()),
    [UpdatedAt] datetime2 NOT NULL DEFAULT (GETUTCDATE()),
    CONSTRAINT [PK_Icons] PRIMARY KEY ([Id]),
    CONSTRAINT [CK_Icons_Parent] CHECK (([IconCategoryId] IS NOT NULL AND [IconGroupId] IS NULL) OR ([IconCategoryId] IS NULL AND [IconGroupId] IS NOT NULL) OR ([IconCategoryId] IS NOT NULL AND [IconGroupId] IS NOT NULL)),
    CONSTRAINT [CK_Icons_Type] CHECK ([IconType] IN ('native', 'web')),
    CONSTRAINT [FK_Icons_IconCategories_IconCategoryId] FOREIGN KEY ([IconCategoryId]) REFERENCES [SERVICES].[IconCategories] ([Id]),
    CONSTRAINT [FK_Icons_IconGroups_IconGroupId] FOREIGN KEY ([IconGroupId]) REFERENCES [SERVICES].[IconGroups] ([Id])
);
GO

CREATE UNIQUE INDEX [IX_IconCategories_Name] ON [SERVICES].[IconCategories] ([Name]);
GO

CREATE UNIQUE INDEX [IX_IconCategories_PublicId] ON [SERVICES].[IconCategories] ([PublicId]);
GO

CREATE INDEX [IX_IconGroups_IconCategoryId] ON [SERVICES].[IconGroups] ([IconCategoryId]);
GO

CREATE UNIQUE INDEX [IX_IconGroups_PublicId] ON [SERVICES].[IconGroups] ([PublicId]);
GO

CREATE INDEX [IX_Icons_IconCategoryId] ON [SERVICES].[Icons] ([IconCategoryId]);
GO

CREATE INDEX [IX_Icons_IconCategoryId_DisplayOrder] ON [SERVICES].[Icons] ([IconCategoryId], [DisplayOrder]);
GO

CREATE INDEX [IX_Icons_IconGroupId] ON [SERVICES].[Icons] ([IconGroupId]);
GO

CREATE INDEX [IX_Icons_IconGroupId_DisplayOrder] ON [SERVICES].[Icons] ([IconGroupId], [DisplayOrder]);
GO

CREATE UNIQUE INDEX [IX_Icons_PublicId] ON [SERVICES].[Icons] ([PublicId]);
GO

INSERT INTO [__EFMigrationsHistory] ([MigrationId], [ProductVersion])
VALUES (N'20250920152947_AddIconManagementTables', N'8.0.0');
GO

COMMIT;
GO

BEGIN TRANSACTION;
GO

CREATE TABLE [SERVICES].[Banners] (
    [Id] int NOT NULL IDENTITY,
    [PublicId] uniqueidentifier NOT NULL DEFAULT (NEWSEQUENTIALID()),
    [Title] nvarchar(200) NOT NULL,
    [ImagePublicId] uniqueidentifier NOT NULL,
    [Position] nvarchar(20) NOT NULL,
    [BannerType] nvarchar(20) NOT NULL,
    [NativeParams] nvarchar(500) NULL,
    [WebLink] nvarchar(500) NULL,
    [IsActive] bit NOT NULL DEFAULT CAST(1 AS bit),
    [CreatedAt] datetime2 NOT NULL DEFAULT (GETUTCDATE()),
    [UpdatedAt] datetime2 NOT NULL DEFAULT (GETUTCDATE()),
    CONSTRAINT [PK_Banners] PRIMARY KEY ([Id]),
    CONSTRAINT [CK_Banners_Position] CHECK ([Position] IN ('top', 'middle', 'bottom')),
    CONSTRAINT [CK_Banners_Type] CHECK ([BannerType] IN ('native', 'web'))
);
GO

CREATE INDEX [IX_Banners_ImagePublicId] ON [SERVICES].[Banners] ([ImagePublicId]);
GO

CREATE UNIQUE INDEX [IX_Banners_PublicId] ON [SERVICES].[Banners] ([PublicId]);
GO

INSERT INTO [__EFMigrationsHistory] ([MigrationId], [ProductVersion])
VALUES (N'20250921034426_AddBannerTable', N'8.0.0');
GO

COMMIT;
GO

BEGIN TRANSACTION;
GO

IF SCHEMA_ID(N'FEEDBACK') IS NULL EXEC(N'CREATE SCHEMA [FEEDBACK];');
GO

CREATE TABLE [FEEDBACK].[Department] (
    [Id] int NOT NULL IDENTITY,
    [PublicId] uniqueidentifier NOT NULL DEFAULT (NEWSEQUENTIALID()),
    [Code] nvarchar(50) NOT NULL,
    [Name] nvarchar(200) NOT NULL,
    [Description] nvarchar(500) NULL,
    [ContactEmail] nvarchar(255) NULL,
    [ContactPhone] nvarchar(20) NULL,
    [IsActive] bit NOT NULL DEFAULT CAST(1 AS bit),
    [CreatedAt] datetime2 NOT NULL DEFAULT (GETUTCDATE()),
    [UpdatedAt] datetime2 NOT NULL DEFAULT (GETUTCDATE()),
    CONSTRAINT [PK_Department] PRIMARY KEY ([Id])
);
GO

CREATE TABLE [FEEDBACK].[FeedbackStatus] (
    [Id] int NOT NULL IDENTITY,
    [PublicId] uniqueidentifier NOT NULL DEFAULT (NEWSEQUENTIALID()),
    [Code] nvarchar(50) NOT NULL,
    [Name] nvarchar(100) NOT NULL,
    [Description] nvarchar(500) NULL,
    [Color] nvarchar(20) NULL,
    [SortOrder] int NOT NULL,
    [IsActive] bit NOT NULL DEFAULT CAST(1 AS bit),
    [CreatedAt] datetime2 NOT NULL DEFAULT (GETUTCDATE()),
    [UpdatedAt] datetime2 NOT NULL DEFAULT (GETUTCDATE()),
    CONSTRAINT [PK_FeedbackStatus] PRIMARY KEY ([Id])
);
GO

CREATE TABLE [FEEDBACK].[Feedback] (
    [Id] int NOT NULL IDENTITY,
    [PublicId] uniqueidentifier NOT NULL DEFAULT (NEWSEQUENTIALID()),
    [Title] nvarchar(500) NOT NULL,
    [Content] nvarchar(max) NOT NULL,
    [FullName] nvarchar(200) NOT NULL,
    [PhoneNumber] nvarchar(20) NULL,
    [Location] nvarchar(500) NULL,
    [IsPublic] bit NOT NULL DEFAULT CAST(0 AS bit),
    [CurrentStatusId] int NOT NULL,
    [AssignedDepartmentId] int NULL,
    [IsActive] bit NOT NULL DEFAULT CAST(1 AS bit),
    [CreatedAt] datetime2 NOT NULL DEFAULT (GETUTCDATE()),
    [UpdatedAt] datetime2 NOT NULL DEFAULT (GETUTCDATE()),
    CONSTRAINT [PK_Feedback] PRIMARY KEY ([Id]),
    CONSTRAINT [FK_Feedback_Department_AssignedDepartmentId] FOREIGN KEY ([AssignedDepartmentId]) REFERENCES [FEEDBACK].[Department] ([Id]) ON DELETE SET NULL,
    CONSTRAINT [FK_Feedback_FeedbackStatus_CurrentStatusId] FOREIGN KEY ([CurrentStatusId]) REFERENCES [FEEDBACK].[FeedbackStatus] ([Id]) ON DELETE NO ACTION
);
GO

CREATE TABLE [FEEDBACK].[FeedbackAttachment] (
    [Id] int NOT NULL IDENTITY,
    [PublicId] uniqueidentifier NOT NULL DEFAULT (NEWSEQUENTIALID()),
    [FeedbackId] int NOT NULL,
    [FilePublicId] uniqueidentifier NOT NULL,
    [FileName] nvarchar(500) NOT NULL,
    [FileSize] bigint NOT NULL,
    [FileType] nvarchar(10) NULL,
    [SortOrder] int NOT NULL,
    [IsActive] bit NOT NULL DEFAULT CAST(1 AS bit),
    [CreatedAt] datetime2 NOT NULL DEFAULT (GETUTCDATE()),
    CONSTRAINT [PK_FeedbackAttachment] PRIMARY KEY ([Id]),
    CONSTRAINT [FK_FeedbackAttachment_Feedback_FeedbackId] FOREIGN KEY ([FeedbackId]) REFERENCES [FEEDBACK].[Feedback] ([Id]) ON DELETE CASCADE
);
GO

CREATE TABLE [FEEDBACK].[FeedbackProcessing] (
    [Id] int NOT NULL IDENTITY,
    [PublicId] uniqueidentifier NOT NULL DEFAULT (NEWSEQUENTIALID()),
    [FeedbackId] int NOT NULL,
    [FromStatusId] int NOT NULL,
    [ToStatusId] int NOT NULL,
    [AssignedDepartmentId] int NULL,
    [AssignedByUserPublicId] uniqueidentifier NULL,
    [AssignedAt] datetime2 NOT NULL DEFAULT (GETUTCDATE()),
    [ProcessingNote] nvarchar(1000) NULL,
    [IsActive] bit NOT NULL DEFAULT CAST(1 AS bit),
    [CreatedAt] datetime2 NOT NULL DEFAULT (GETUTCDATE()),
    CONSTRAINT [PK_FeedbackProcessing] PRIMARY KEY ([Id]),
    CONSTRAINT [FK_FeedbackProcessing_Department_AssignedDepartmentId] FOREIGN KEY ([AssignedDepartmentId]) REFERENCES [FEEDBACK].[Department] ([Id]) ON DELETE SET NULL,
    CONSTRAINT [FK_FeedbackProcessing_FeedbackStatus_FromStatusId] FOREIGN KEY ([FromStatusId]) REFERENCES [FEEDBACK].[FeedbackStatus] ([Id]) ON DELETE NO ACTION,
    CONSTRAINT [FK_FeedbackProcessing_FeedbackStatus_ToStatusId] FOREIGN KEY ([ToStatusId]) REFERENCES [FEEDBACK].[FeedbackStatus] ([Id]) ON DELETE NO ACTION,
    CONSTRAINT [FK_FeedbackProcessing_Feedback_FeedbackId] FOREIGN KEY ([FeedbackId]) REFERENCES [FEEDBACK].[Feedback] ([Id]) ON DELETE CASCADE
);
GO

CREATE TABLE [FEEDBACK].[FeedbackResponse] (
    [Id] int NOT NULL IDENTITY,
    [PublicId] uniqueidentifier NOT NULL DEFAULT (NEWSEQUENTIALID()),
    [FeedbackId] int NOT NULL,
    [DepartmentId] int NOT NULL,
    [ResponseContent] nvarchar(max) NOT NULL,
    [ResponseAttachments] nvarchar(1000) NULL,
    [IsApproved] bit NULL,
    [ApprovedByUserPublicId] uniqueidentifier NULL,
    [ApprovedAt] datetime2 NULL,
    [ApprovalNote] nvarchar(500) NULL,
    [IsActive] bit NOT NULL DEFAULT CAST(1 AS bit),
    [CreatedAt] datetime2 NOT NULL DEFAULT (GETUTCDATE()),
    [UpdatedAt] datetime2 NOT NULL DEFAULT (GETUTCDATE()),
    CONSTRAINT [PK_FeedbackResponse] PRIMARY KEY ([Id]),
    CONSTRAINT [FK_FeedbackResponse_Department_DepartmentId] FOREIGN KEY ([DepartmentId]) REFERENCES [FEEDBACK].[Department] ([Id]) ON DELETE NO ACTION,
    CONSTRAINT [FK_FeedbackResponse_Feedback_FeedbackId] FOREIGN KEY ([FeedbackId]) REFERENCES [FEEDBACK].[Feedback] ([Id]) ON DELETE CASCADE
);
GO

CREATE UNIQUE INDEX [IX_Department_Code] ON [FEEDBACK].[Department] ([Code]);
GO

CREATE UNIQUE INDEX [IX_Department_PublicId] ON [FEEDBACK].[Department] ([PublicId]);
GO

CREATE INDEX [IX_Feedback_AssignedDepartmentId] ON [FEEDBACK].[Feedback] ([AssignedDepartmentId]);
GO

CREATE INDEX [IX_Feedback_CurrentStatusId] ON [FEEDBACK].[Feedback] ([CurrentStatusId]);
GO

CREATE UNIQUE INDEX [IX_Feedback_PublicId] ON [FEEDBACK].[Feedback] ([PublicId]);
GO

CREATE INDEX [IX_FeedbackAttachment_FeedbackId] ON [FEEDBACK].[FeedbackAttachment] ([FeedbackId]);
GO

CREATE UNIQUE INDEX [IX_FeedbackAttachment_PublicId] ON [FEEDBACK].[FeedbackAttachment] ([PublicId]);
GO

CREATE INDEX [IX_FeedbackProcessing_AssignedDepartmentId] ON [FEEDBACK].[FeedbackProcessing] ([AssignedDepartmentId]);
GO

CREATE INDEX [IX_FeedbackProcessing_FeedbackId] ON [FEEDBACK].[FeedbackProcessing] ([FeedbackId]);
GO

CREATE INDEX [IX_FeedbackProcessing_FromStatusId] ON [FEEDBACK].[FeedbackProcessing] ([FromStatusId]);
GO

CREATE UNIQUE INDEX [IX_FeedbackProcessing_PublicId] ON [FEEDBACK].[FeedbackProcessing] ([PublicId]);
GO

CREATE INDEX [IX_FeedbackProcessing_ToStatusId] ON [FEEDBACK].[FeedbackProcessing] ([ToStatusId]);
GO

CREATE INDEX [IX_FeedbackResponse_DepartmentId] ON [FEEDBACK].[FeedbackResponse] ([DepartmentId]);
GO

CREATE INDEX [IX_FeedbackResponse_FeedbackId] ON [FEEDBACK].[FeedbackResponse] ([FeedbackId]);
GO

CREATE UNIQUE INDEX [IX_FeedbackResponse_PublicId] ON [FEEDBACK].[FeedbackResponse] ([PublicId]);
GO

CREATE UNIQUE INDEX [IX_FeedbackStatus_Code] ON [FEEDBACK].[FeedbackStatus] ([Code]);
GO

CREATE UNIQUE INDEX [IX_FeedbackStatus_PublicId] ON [FEEDBACK].[FeedbackStatus] ([PublicId]);
GO

INSERT INTO [__EFMigrationsHistory] ([MigrationId], [ProductVersion])
VALUES (N'20250921105052_AddFeedbackManagementSchema', N'8.0.0');
GO

COMMIT;
GO

BEGIN TRANSACTION;
GO

IF SCHEMA_ID(N'PRODUCTS') IS NULL EXEC(N'CREATE SCHEMA [PRODUCTS];');
GO

CREATE TABLE [PRODUCTS].[OcopEnterprises] (
    [Id] int NOT NULL IDENTITY,
    [PublicId] uniqueidentifier NOT NULL DEFAULT (NEWSEQUENTIALID()),
    [Name] nvarchar(255) NOT NULL,
    [PhoneNumber] nvarchar(20) NULL,
    [Representative] nvarchar(255) NULL,
    [TaxCode] nvarchar(20) NULL,
    [EstablishedYear] int NULL,
    [Address] nvarchar(500) NULL,
    [OcopCertificateNumber] nvarchar(100) NULL,
    [Latitude] decimal(10,8) NULL,
    [Longitude] decimal(11,8) NULL,
    [IsActive] bit NOT NULL DEFAULT CAST(1 AS bit),
    [CreatedAt] datetime2 NOT NULL DEFAULT (GETUTCDATE()),
    [UpdatedAt] datetime2 NOT NULL DEFAULT (GETUTCDATE()),
    CONSTRAINT [PK_OcopEnterprises] PRIMARY KEY ([Id])
);
GO

CREATE TABLE [PRODUCTS].[OcopProductCategories] (
    [Id] int NOT NULL IDENTITY,
    [PublicId] uniqueidentifier NOT NULL DEFAULT (NEWSEQUENTIALID()),
    [Name] nvarchar(255) NOT NULL,
    [Description] nvarchar(500) NULL,
    [ImageUrl] nvarchar(500) NULL,
    [DisplayOrder] int NOT NULL DEFAULT 0,
    [IsActive] bit NOT NULL DEFAULT CAST(1 AS bit),
    [CreatedAt] datetime2 NOT NULL DEFAULT (GETUTCDATE()),
    [UpdatedAt] datetime2 NOT NULL DEFAULT (GETUTCDATE()),
    CONSTRAINT [PK_OcopProductCategories] PRIMARY KEY ([Id])
);
GO

CREATE TABLE [PRODUCTS].[OcopProducts] (
    [Id] int NOT NULL IDENTITY,
    [PublicId] uniqueidentifier NOT NULL DEFAULT (NEWSEQUENTIALID()),
    [Name] nvarchar(255) NOT NULL,
    [Description] nvarchar(max) NULL,
    [CategoryId] int NOT NULL,
    [EnterpriseId] int NOT NULL,
    [ReferencePrice] decimal(18,2) NULL,
    [PromotionalPrice] decimal(18,2) NULL,
    [ContactPhone] nvarchar(20) NULL,
    [ContactAddress] nvarchar(500) NULL,
    [Latitude] decimal(10,8) NULL,
    [Longitude] decimal(11,8) NULL,
    [IsActive] bit NOT NULL DEFAULT CAST(1 AS bit),
    [CreatedAt] datetime2 NOT NULL DEFAULT (GETUTCDATE()),
    [UpdatedAt] datetime2 NOT NULL DEFAULT (GETUTCDATE()),
    CONSTRAINT [PK_OcopProducts] PRIMARY KEY ([Id]),
    CONSTRAINT [FK_OcopProducts_OcopEnterprises_EnterpriseId] FOREIGN KEY ([EnterpriseId]) REFERENCES [PRODUCTS].[OcopEnterprises] ([Id]) ON DELETE CASCADE,
    CONSTRAINT [FK_OcopProducts_OcopProductCategories_CategoryId] FOREIGN KEY ([CategoryId]) REFERENCES [PRODUCTS].[OcopProductCategories] ([Id]) ON DELETE CASCADE
);
GO

CREATE TABLE [PRODUCTS].[OcopProductImages] (
    [Id] int NOT NULL IDENTITY,
    [PublicId] uniqueidentifier NOT NULL DEFAULT (NEWSEQUENTIALID()),
    [ProductId] int NOT NULL,
    [ImageUrl] nvarchar(500) NOT NULL,
    [DisplayOrder] int NOT NULL DEFAULT 0,
    [IsPrimary] bit NOT NULL DEFAULT CAST(0 AS bit),
    [Caption] nvarchar(255) NULL,
    [CreatedAt] datetime2 NOT NULL DEFAULT (GETUTCDATE()),
    CONSTRAINT [PK_OcopProductImages] PRIMARY KEY ([Id]),
    CONSTRAINT [FK_OcopProductImages_OcopProducts_ProductId] FOREIGN KEY ([ProductId]) REFERENCES [PRODUCTS].[OcopProducts] ([Id]) ON DELETE CASCADE
);
GO

CREATE INDEX [IX_OcopEnterprises_Latitude_Longitude] ON [PRODUCTS].[OcopEnterprises] ([Latitude], [Longitude]);
GO

CREATE INDEX [IX_OcopEnterprises_Name] ON [PRODUCTS].[OcopEnterprises] ([Name]);
GO

CREATE UNIQUE INDEX [IX_OcopEnterprises_PublicId] ON [PRODUCTS].[OcopEnterprises] ([PublicId]);
GO

CREATE INDEX [IX_OcopEnterprises_TaxCode] ON [PRODUCTS].[OcopEnterprises] ([TaxCode]);
GO

CREATE INDEX [IX_OcopProductCategories_IsActive_DisplayOrder] ON [PRODUCTS].[OcopProductCategories] ([IsActive], [DisplayOrder]);
GO

CREATE UNIQUE INDEX [IX_OcopProductCategories_Name] ON [PRODUCTS].[OcopProductCategories] ([Name]);
GO

CREATE UNIQUE INDEX [IX_OcopProductCategories_PublicId] ON [PRODUCTS].[OcopProductCategories] ([PublicId]);
GO

CREATE INDEX [IX_OcopProductImages_ProductId] ON [PRODUCTS].[OcopProductImages] ([ProductId]);
GO

CREATE INDEX [IX_OcopProductImages_ProductId_DisplayOrder] ON [PRODUCTS].[OcopProductImages] ([ProductId], [DisplayOrder]);
GO

CREATE UNIQUE INDEX [IX_OcopProductImages_PublicId] ON [PRODUCTS].[OcopProductImages] ([PublicId]);
GO

CREATE INDEX [IX_OcopProducts_CategoryId] ON [PRODUCTS].[OcopProducts] ([CategoryId]);
GO

CREATE INDEX [IX_OcopProducts_EnterpriseId] ON [PRODUCTS].[OcopProducts] ([EnterpriseId]);
GO

CREATE INDEX [IX_OcopProducts_Latitude_Longitude] ON [PRODUCTS].[OcopProducts] ([Latitude], [Longitude]);
GO

CREATE INDEX [IX_OcopProducts_Name] ON [PRODUCTS].[OcopProducts] ([Name]);
GO

CREATE UNIQUE INDEX [IX_OcopProducts_PublicId] ON [PRODUCTS].[OcopProducts] ([PublicId]);
GO

INSERT INTO [__EFMigrationsHistory] ([MigrationId], [ProductVersion])
VALUES (N'20250922005237_AddOcopProductsSchema', N'8.0.0');
GO

COMMIT;
GO

BEGIN TRANSACTION;
GO

ALTER TABLE [PRODUCTS].[OcopProductImages] ADD [IsActive] bit NOT NULL DEFAULT CAST(0 AS bit);
GO

CREATE TABLE [PRODUCTS].[OcopEnterpriseDocuments] (
    [Id] int NOT NULL IDENTITY,
    [PublicId] uniqueidentifier NOT NULL DEFAULT (NEWSEQUENTIALID()),
    [EnterpriseId] int NOT NULL,
    [DocumentUrl] nvarchar(500) NOT NULL,
    [DocumentName] nvarchar(255) NOT NULL,
    [Description] nvarchar(500) NULL,
    [DisplayOrder] int NOT NULL DEFAULT 0,
    [IsActive] bit NOT NULL DEFAULT CAST(1 AS bit),
    [CreatedAt] datetime2 NOT NULL DEFAULT (GETUTCDATE()),
    CONSTRAINT [PK_OcopEnterpriseDocuments] PRIMARY KEY ([Id]),
    CONSTRAINT [FK_OcopEnterpriseDocuments_OcopEnterprises_EnterpriseId] FOREIGN KEY ([EnterpriseId]) REFERENCES [PRODUCTS].[OcopEnterprises] ([Id]) ON DELETE CASCADE
);
GO

CREATE INDEX [IX_OcopEnterpriseDocuments_EnterpriseId] ON [PRODUCTS].[OcopEnterpriseDocuments] ([EnterpriseId]);
GO

CREATE INDEX [IX_OcopEnterpriseDocuments_EnterpriseId_DisplayOrder] ON [PRODUCTS].[OcopEnterpriseDocuments] ([EnterpriseId], [DisplayOrder]);
GO

CREATE UNIQUE INDEX [IX_OcopEnterpriseDocuments_PublicId] ON [PRODUCTS].[OcopEnterpriseDocuments] ([PublicId]);
GO

INSERT INTO [__EFMigrationsHistory] ([MigrationId], [ProductVersion])
VALUES (N'20250922024002_AddIsActiveToOcopProductImages', N'8.0.0');
GO

COMMIT;
GO

BEGIN TRANSACTION;
GO

CREATE TABLE [SERVICES].[SupportGroupCategories] (
    [Id] int NOT NULL IDENTITY,
    [PublicId] uniqueidentifier NOT NULL DEFAULT (NEWSEQUENTIALID()),
    [Name] nvarchar(255) NOT NULL,
    [Description] nvarchar(1000) NULL,
    [IsActive] bit NOT NULL DEFAULT CAST(1 AS bit),
    [CreatedAt] datetime2 NOT NULL DEFAULT (GETUTCDATE()),
    [UpdatedAt] datetime2 NOT NULL DEFAULT (GETUTCDATE()),
    CONSTRAINT [PK_SupportGroupCategories] PRIMARY KEY ([Id])
);
GO

CREATE TABLE [SERVICES].[SupportGroups] (
    [Id] int NOT NULL IDENTITY,
    [PublicId] uniqueidentifier NOT NULL DEFAULT (NEWSEQUENTIALID()),
    [CategoryId] int NOT NULL,
    [GroupName] nvarchar(255) NOT NULL,
    [GroupLink] nvarchar(500) NOT NULL,
    [GroupType] nvarchar(50) NOT NULL,
    [Description] nvarchar(500) NULL,
    [IsActive] bit NOT NULL DEFAULT CAST(1 AS bit),
    [CreatedAt] datetime2 NOT NULL DEFAULT (GETUTCDATE()),
    [UpdatedAt] datetime2 NOT NULL DEFAULT (GETUTCDATE()),
    CONSTRAINT [PK_SupportGroups] PRIMARY KEY ([Id]),
    CONSTRAINT [FK_SupportGroups_SupportGroupCategories_CategoryId] FOREIGN KEY ([CategoryId]) REFERENCES [SERVICES].[SupportGroupCategories] ([Id]) ON DELETE CASCADE
);
GO

CREATE UNIQUE INDEX [IX_SupportGroupCategories_Name] ON [SERVICES].[SupportGroupCategories] ([Name]);
GO

CREATE UNIQUE INDEX [IX_SupportGroupCategories_PublicId] ON [SERVICES].[SupportGroupCategories] ([PublicId]);
GO

CREATE INDEX [IX_SupportGroups_CategoryId] ON [SERVICES].[SupportGroups] ([CategoryId]);
GO

CREATE UNIQUE INDEX [IX_SupportGroups_PublicId] ON [SERVICES].[SupportGroups] ([PublicId]);
GO

INSERT INTO [__EFMigrationsHistory] ([MigrationId], [ProductVersion])
VALUES (N'20250922032030_AddSupportGroupsTables', N'8.0.0');
GO

COMMIT;
GO

BEGIN TRANSACTION;
GO

CREATE TABLE [FEEDBACK].[FeedbackResponseAttachment] (
    [Id] int NOT NULL IDENTITY,
    [PublicId] uniqueidentifier NOT NULL,
    [FeedbackResponseId] int NOT NULL,
    [FilePublicId] uniqueidentifier NOT NULL,
    [FileName] nvarchar(500) NOT NULL,
    [FileSize] bigint NOT NULL,
    [FileType] nvarchar(10) NULL,
    [SortOrder] int NOT NULL,
    [IsActive] bit NOT NULL,
    [CreatedAt] datetime2 NOT NULL,
    CONSTRAINT [PK_FeedbackResponseAttachment] PRIMARY KEY ([Id]),
    CONSTRAINT [FK_FeedbackResponseAttachment_FeedbackResponse_FeedbackResponseId] FOREIGN KEY ([FeedbackResponseId]) REFERENCES [FEEDBACK].[FeedbackResponse] ([Id]) ON DELETE CASCADE
);
GO

CREATE INDEX [IX_FeedbackResponseAttachment_FeedbackResponseId] ON [FEEDBACK].[FeedbackResponseAttachment] ([FeedbackResponseId]);
GO

INSERT INTO [__EFMigrationsHistory] ([MigrationId], [ProductVersion])
VALUES (N'20250926103255_AddFeedbackResponseAttachment', N'8.0.0');
GO

COMMIT;
GO

BEGIN TRANSACTION;
GO

DECLARE @var3 sysname;
SELECT @var3 = [d].[name]
FROM [sys].[default_constraints] [d]
INNER JOIN [sys].[columns] [c] ON [d].[parent_column_id] = [c].[column_id] AND [d].[parent_object_id] = [c].[object_id]
WHERE ([d].[parent_object_id] = OBJECT_ID(N'[FEEDBACK].[FeedbackResponseAttachment]') AND [c].[name] = N'PublicId');
IF @var3 IS NOT NULL EXEC(N'ALTER TABLE [FEEDBACK].[FeedbackResponseAttachment] DROP CONSTRAINT [' + @var3 + '];');
ALTER TABLE [FEEDBACK].[FeedbackResponseAttachment] ADD DEFAULT (NEWSEQUENTIALID()) FOR [PublicId];
GO

DECLARE @var4 sysname;
SELECT @var4 = [d].[name]
FROM [sys].[default_constraints] [d]
INNER JOIN [sys].[columns] [c] ON [d].[parent_column_id] = [c].[column_id] AND [d].[parent_object_id] = [c].[object_id]
WHERE ([d].[parent_object_id] = OBJECT_ID(N'[FEEDBACK].[FeedbackResponseAttachment]') AND [c].[name] = N'IsActive');
IF @var4 IS NOT NULL EXEC(N'ALTER TABLE [FEEDBACK].[FeedbackResponseAttachment] DROP CONSTRAINT [' + @var4 + '];');
ALTER TABLE [FEEDBACK].[FeedbackResponseAttachment] ADD DEFAULT CAST(1 AS bit) FOR [IsActive];
GO

DECLARE @var5 sysname;
SELECT @var5 = [d].[name]
FROM [sys].[default_constraints] [d]
INNER JOIN [sys].[columns] [c] ON [d].[parent_column_id] = [c].[column_id] AND [d].[parent_object_id] = [c].[object_id]
WHERE ([d].[parent_object_id] = OBJECT_ID(N'[FEEDBACK].[FeedbackResponseAttachment]') AND [c].[name] = N'FileType');
IF @var5 IS NOT NULL EXEC(N'ALTER TABLE [FEEDBACK].[FeedbackResponseAttachment] DROP CONSTRAINT [' + @var5 + '];');
ALTER TABLE [FEEDBACK].[FeedbackResponseAttachment] ALTER COLUMN [FileType] nvarchar(100) NULL;
GO

DECLARE @var6 sysname;
SELECT @var6 = [d].[name]
FROM [sys].[default_constraints] [d]
INNER JOIN [sys].[columns] [c] ON [d].[parent_column_id] = [c].[column_id] AND [d].[parent_object_id] = [c].[object_id]
WHERE ([d].[parent_object_id] = OBJECT_ID(N'[FEEDBACK].[FeedbackResponseAttachment]') AND [c].[name] = N'CreatedAt');
IF @var6 IS NOT NULL EXEC(N'ALTER TABLE [FEEDBACK].[FeedbackResponseAttachment] DROP CONSTRAINT [' + @var6 + '];');
ALTER TABLE [FEEDBACK].[FeedbackResponseAttachment] ADD DEFAULT (GETUTCDATE()) FOR [CreatedAt];
GO

DECLARE @var7 sysname;
SELECT @var7 = [d].[name]
FROM [sys].[default_constraints] [d]
INNER JOIN [sys].[columns] [c] ON [d].[parent_column_id] = [c].[column_id] AND [d].[parent_object_id] = [c].[object_id]
WHERE ([d].[parent_object_id] = OBJECT_ID(N'[FEEDBACK].[FeedbackAttachment]') AND [c].[name] = N'FileType');
IF @var7 IS NOT NULL EXEC(N'ALTER TABLE [FEEDBACK].[FeedbackAttachment] DROP CONSTRAINT [' + @var7 + '];');
ALTER TABLE [FEEDBACK].[FeedbackAttachment] ALTER COLUMN [FileType] nvarchar(100) NULL;
GO

CREATE UNIQUE INDEX [IX_FeedbackResponseAttachment_PublicId] ON [FEEDBACK].[FeedbackResponseAttachment] ([PublicId]);
GO

INSERT INTO [__EFMigrationsHistory] ([MigrationId], [ProductVersion])
VALUES (N'20251014035142_FixFeedbackAttachmentFileTypeLength', N'8.0.0');
GO

COMMIT;
GO

BEGIN TRANSACTION;
GO

ALTER TABLE [FEEDBACK].[Feedback] DROP CONSTRAINT [FK_Feedback_Department_AssignedDepartmentId];
GO

ALTER TABLE [FEEDBACK].[FeedbackProcessing] DROP CONSTRAINT [FK_FeedbackProcessing_Department_AssignedDepartmentId];
GO

ALTER TABLE [FEEDBACK].[FeedbackResponse] DROP CONSTRAINT [FK_FeedbackResponse_Department_DepartmentId];
GO

DROP INDEX [IX_Department_Code] ON [FEEDBACK].[Department];
GO

DROP INDEX [IX_Department_PublicId] ON [FEEDBACK].[Department];
GO

DECLARE @var8 sysname;
SELECT @var8 = [d].[name]
FROM [sys].[default_constraints] [d]
INNER JOIN [sys].[columns] [c] ON [d].[parent_column_id] = [c].[column_id] AND [d].[parent_object_id] = [c].[object_id]
WHERE ([d].[parent_object_id] = OBJECT_ID(N'[FEEDBACK].[Department]') AND [c].[name] = N'UpdatedAt');
IF @var8 IS NOT NULL EXEC(N'ALTER TABLE [FEEDBACK].[Department] DROP CONSTRAINT [' + @var8 + '];');
GO

DECLARE @var9 sysname;
SELECT @var9 = [d].[name]
FROM [sys].[default_constraints] [d]
INNER JOIN [sys].[columns] [c] ON [d].[parent_column_id] = [c].[column_id] AND [d].[parent_object_id] = [c].[object_id]
WHERE ([d].[parent_object_id] = OBJECT_ID(N'[FEEDBACK].[Department]') AND [c].[name] = N'PublicId');
IF @var9 IS NOT NULL EXEC(N'ALTER TABLE [FEEDBACK].[Department] DROP CONSTRAINT [' + @var9 + '];');
GO

DECLARE @var10 sysname;
SELECT @var10 = [d].[name]
FROM [sys].[default_constraints] [d]
INNER JOIN [sys].[columns] [c] ON [d].[parent_column_id] = [c].[column_id] AND [d].[parent_object_id] = [c].[object_id]
WHERE ([d].[parent_object_id] = OBJECT_ID(N'[FEEDBACK].[Department]') AND [c].[name] = N'IsActive');
IF @var10 IS NOT NULL EXEC(N'ALTER TABLE [FEEDBACK].[Department] DROP CONSTRAINT [' + @var10 + '];');
GO

DECLARE @var11 sysname;
SELECT @var11 = [d].[name]
FROM [sys].[default_constraints] [d]
INNER JOIN [sys].[columns] [c] ON [d].[parent_column_id] = [c].[column_id] AND [d].[parent_object_id] = [c].[object_id]
WHERE ([d].[parent_object_id] = OBJECT_ID(N'[FEEDBACK].[Department]') AND [c].[name] = N'CreatedAt');
IF @var11 IS NOT NULL EXEC(N'ALTER TABLE [FEEDBACK].[Department] DROP CONSTRAINT [' + @var11 + '];');
GO

ALTER TABLE [FEEDBACK].[Feedback] ADD CONSTRAINT [FK_Feedback_Department_AssignedDepartmentId] FOREIGN KEY ([AssignedDepartmentId]) REFERENCES [FEEDBACK].[Department] ([Id]);
GO

ALTER TABLE [FEEDBACK].[FeedbackProcessing] ADD CONSTRAINT [FK_FeedbackProcessing_Department_AssignedDepartmentId] FOREIGN KEY ([AssignedDepartmentId]) REFERENCES [FEEDBACK].[Department] ([Id]);
GO

ALTER TABLE [FEEDBACK].[FeedbackResponse] ADD CONSTRAINT [FK_FeedbackResponse_Department_DepartmentId] FOREIGN KEY ([DepartmentId]) REFERENCES [FEEDBACK].[Department] ([Id]) ON DELETE CASCADE;
GO

INSERT INTO [__EFMigrationsHistory] ([MigrationId], [ProductVersion])
VALUES (N'20251018174715_UpdateFeedbackForeignKeysToCommonDepartment', N'8.0.0');
GO

COMMIT;
GO

BEGIN TRANSACTION;
GO

ALTER TABLE [FEEDBACK].[Feedback] DROP CONSTRAINT [FK_Feedback_Department_AssignedDepartmentId];
GO

ALTER TABLE [FEEDBACK].[FeedbackProcessing] DROP CONSTRAINT [FK_FeedbackProcessing_Department_AssignedDepartmentId];
GO

ALTER TABLE [FEEDBACK].[FeedbackResponse] DROP CONSTRAINT [FK_FeedbackResponse_Department_DepartmentId];
GO

DROP TABLE [FEEDBACK].[Department];
GO

INSERT INTO [__EFMigrationsHistory] ([MigrationId], [ProductVersion])
VALUES (N'20251020012059_RemoveFeedbackDepartmentTable', N'8.0.0');
GO

COMMIT;
GO

BEGIN TRANSACTION;
GO

ALTER TABLE [PLACES].[HotelImages] ADD [ImagePublicId] uniqueidentifier NOT NULL DEFAULT '00000000-0000-0000-0000-000000000000';
GO

INSERT INTO [__EFMigrationsHistory] ([MigrationId], [ProductVersion])
VALUES (N'20251108142355_AddImagePublicIdToHotelImage', N'8.0.0');
GO

COMMIT;
GO

BEGIN TRANSACTION;
GO

ALTER TABLE [PLACES].[RestaurantImages] ADD [ImagePublicId] uniqueidentifier NOT NULL DEFAULT '00000000-0000-0000-0000-000000000000';
GO

INSERT INTO [__EFMigrationsHistory] ([MigrationId], [ProductVersion])
VALUES (N'20251108143553_AddImagePublicIdToRestaurantImage', N'8.0.0');
GO

COMMIT;
GO

BEGIN TRANSACTION;
GO

ALTER TABLE [PLACES].[HomestayImages] ADD [ImagePublicId] uniqueidentifier NOT NULL DEFAULT '00000000-0000-0000-0000-000000000000';
GO

INSERT INTO [__EFMigrationsHistory] ([MigrationId], [ProductVersion])
VALUES (N'20251109033305_AddImagePublicIdToHomestayImage', N'8.0.0');
GO

COMMIT;
GO

BEGIN TRANSACTION;
GO

ALTER TABLE [SERVICES].[Icons] ADD [ImagePublicId] uniqueidentifier NULL;
GO

INSERT INTO [__EFMigrationsHistory] ([MigrationId], [ProductVersion])
VALUES (N'20251112045111_AddImagePublicIdToIconsServicesTable', N'8.0.0');
GO

COMMIT;
GO

BEGIN TRANSACTION;
GO

CREATE TABLE [SERVICES].[TotalUsers] (
    [Id] int NOT NULL IDENTITY,
    [UserId] int NOT NULL,
    [Username] nvarchar(255) NOT NULL,
    [Avatar] nvarchar(500) NULL,
    [PhanQuyen] nvarchar(100) NULL,
    CONSTRAINT [PK_TotalUsers] PRIMARY KEY ([Id])
);
GO

CREATE INDEX [IX_TotalUsers_UserId] ON [SERVICES].[TotalUsers] ([UserId]);
GO

INSERT INTO [__EFMigrationsHistory] ([MigrationId], [ProductVersion])
VALUES (N'20251128090000_AddTotalUsersTable', N'8.0.0');
GO

COMMIT;
GO

BEGIN TRANSACTION;
GO

DROP INDEX [IX_TotalUsers_UserId] ON [SERVICES].[TotalUsers];
GO

DECLARE @var12 sysname;
SELECT @var12 = [d].[name]
FROM [sys].[default_constraints] [d]
INNER JOIN [sys].[columns] [c] ON [d].[parent_column_id] = [c].[column_id] AND [d].[parent_object_id] = [c].[object_id]
WHERE ([d].[parent_object_id] = OBJECT_ID(N'[SERVICES].[TotalUsers]') AND [c].[name] = N'UserId');
IF @var12 IS NOT NULL EXEC(N'ALTER TABLE [SERVICES].[TotalUsers] DROP CONSTRAINT [' + @var12 + '];');
ALTER TABLE [SERVICES].[TotalUsers] ALTER COLUMN [UserId] nvarchar(100) NOT NULL;
GO

CREATE INDEX [IX_TotalUsers_UserId] ON [SERVICES].[TotalUsers] ([UserId]);
GO

INSERT INTO [__EFMigrationsHistory] ([MigrationId], [ProductVersion])
VALUES (N'20251128091500_ChangeTotalUserIdToString', N'8.0.0');
GO

COMMIT;
GO

BEGIN TRANSACTION;
GO

ALTER TABLE [SERVICES].[Icons] ADD [LinkAndroid] nvarchar(max) NULL;
GO

ALTER TABLE [SERVICES].[Icons] ADD [LinkIOS] nvarchar(max) NULL;
GO

INSERT INTO [__EFMigrationsHistory] ([MigrationId], [ProductVersion])
VALUES (N'20251128094500_AddIconLinksToIcons', N'8.0.0');
GO

COMMIT;
GO

BEGIN TRANSACTION;
GO

ALTER TABLE [PRODUCTS].[OcopProductCategories] ADD [ImagePublicId] uniqueidentifier NULL;
GO

INSERT INTO [__EFMigrationsHistory] ([MigrationId], [ProductVersion])
VALUES (N'20251128095800_AddImagePublicIdToOcopProductCategories', N'8.0.0');
GO

COMMIT;
GO

BEGIN TRANSACTION;
GO

ALTER TABLE [PRODUCTS].[OcopProductImages] ADD [ImagePublicId] uniqueidentifier NOT NULL DEFAULT '00000000-0000-0000-0000-000000000000';
GO

INSERT INTO [__EFMigrationsHistory] ([MigrationId], [ProductVersion])
VALUES (N'20251128100500_AddImagePublicIdToOcopProductImages', N'8.0.0');
GO

COMMIT;
GO

BEGIN TRANSACTION;
GO

ALTER TABLE [SERVICES].[IconGroups] ADD [ImagePublicId] uniqueidentifier NULL;
GO

ALTER TABLE [SERVICES].[IconGroups] ADD [ImageUrl] nvarchar(500) NULL;
GO

CREATE INDEX [IX_IconGroups_ImagePublicId] ON [SERVICES].[IconGroups] ([ImagePublicId]);
GO

INSERT INTO [__EFMigrationsHistory] ([MigrationId], [ProductVersion])
VALUES (N'20251201060430_AddIconGroupImage', N'8.0.0');
GO

COMMIT;
GO

BEGIN TRANSACTION;
GO

ALTER TABLE [PLACES].[Homestays] ADD [LinkVitri] nvarchar(500) NULL;
GO

ALTER TABLE [PLACES].[Homestays] ADD [Website] nvarchar(255) NULL;
GO

INSERT INTO [__EFMigrationsHistory] ([MigrationId], [ProductVersion])
VALUES (N'20251204035407_AddWebsiteAndLinkVitriToHomestays', N'8.0.0');
GO

COMMIT;
GO

BEGIN TRANSACTION;
GO

ALTER TABLE [SERVICES].[TotalUsers] ADD [PhoneNumber] nvarchar(20) NULL;
GO

INSERT INTO [__EFMigrationsHistory] ([MigrationId], [ProductVersion])
VALUES (N'20251205075612_AddPhoneNumberToTotalUsers', N'8.0.0');
GO

COMMIT;
GO

BEGIN TRANSACTION;
GO

ALTER TABLE [PLACES].[Restaurants] ADD [ThuTu] int NOT NULL DEFAULT 0;
GO

INSERT INTO [__EFMigrationsHistory] ([MigrationId], [ProductVersion])
VALUES (N'20251212013413_AddThuTuToRestaurants', N'8.0.0');
GO

COMMIT;
GO

BEGIN TRANSACTION;
GO

ALTER TABLE [PLACES].[Hotels] ADD [ThuTu] int NOT NULL DEFAULT 0;
GO

INSERT INTO [__EFMigrationsHistory] ([MigrationId], [ProductVersion])
VALUES (N'20251212014848_AddThuTuToHotels', N'8.0.0');
GO

COMMIT;
GO

BEGIN TRANSACTION;
GO

ALTER TABLE [PLACES].[Homestays] ADD [ThuTu] int NOT NULL DEFAULT 0;
GO

INSERT INTO [__EFMigrationsHistory] ([MigrationId], [ProductVersion])
VALUES (N'20251212020852_AddThuTuToHomestays', N'8.0.0');
GO

COMMIT;
GO

BEGIN TRANSACTION;
GO

IF SCHEMA_ID(N'KHAOSAT') IS NULL EXEC(N'CREATE SCHEMA [KHAOSAT];');
GO

CREATE TABLE [KHAOSAT].[KhaoSats] (
    [Id] int NOT NULL IDENTITY,
    [TenKhaoSat] nvarchar(255) NOT NULL,
    [ThoiGian] datetime2 NOT NULL,
    [DisplayWebsite] nvarchar(500) NULL,
    [Header] nvarchar(1000) NULL,
    [Footer] nvarchar(1000) NULL,
    [VeViec] nvarchar(1000) NULL,
    [IsActive] bit NOT NULL DEFAULT CAST(1 AS bit),
    [CreatedAt] datetime2 NOT NULL DEFAULT (GETUTCDATE()),
    [UpdatedAt] datetime2 NOT NULL DEFAULT (GETUTCDATE()),
    CONSTRAINT [PK_KhaoSats] PRIMARY KEY ([Id])
);
GO

CREATE TABLE [KHAOSAT].[CauHois] (
    [Id] int NOT NULL IDENTITY,
    [SurveyId] int NOT NULL,
    [NoiDung] nvarchar(max) NOT NULL,
    [CauHoiTuLuan] nvarchar(max) NULL,
    [STT] int NULL,
    CONSTRAINT [PK_CauHois] PRIMARY KEY ([Id]),
    CONSTRAINT [FK_CauHois_KhaoSats_SurveyId] FOREIGN KEY ([SurveyId]) REFERENCES [KHAOSAT].[KhaoSats] ([Id]) ON DELETE CASCADE
);
GO

CREATE TABLE [KHAOSAT].[TuLuans] (
    [Id] int NOT NULL IDENTITY,
    [SurveyId] int NOT NULL,
    [CauHoiTuLuan] nvarchar(max) NOT NULL,
    CONSTRAINT [PK_TuLuans] PRIMARY KEY ([Id]),
    CONSTRAINT [FK_TuLuans_KhaoSats_SurveyId] FOREIGN KEY ([SurveyId]) REFERENCES [KHAOSAT].[KhaoSats] ([Id]) ON DELETE CASCADE
);
GO

CREATE TABLE [KHAOSAT].[YKienKhacs] (
    [Id] int NOT NULL IDENTITY,
    [SurveyId] int NOT NULL,
    [UserID] nvarchar(100) NOT NULL,
    [YKienKhac] nvarchar(max) NOT NULL,
    [CreatedAt] datetime2 NOT NULL DEFAULT (GETUTCDATE()),
    CONSTRAINT [PK_YKienKhacs] PRIMARY KEY ([Id]),
    CONSTRAINT [FK_YKienKhacs_KhaoSats_SurveyId] FOREIGN KEY ([SurveyId]) REFERENCES [KHAOSAT].[KhaoSats] ([Id]) ON DELETE CASCADE
);
GO

CREATE TABLE [KHAOSAT].[TraLois] (
    [Id] int NOT NULL IDENTITY,
    [QuestionId] int NOT NULL,
    [TraLoi] nvarchar(max) NOT NULL,
    CONSTRAINT [PK_TraLois] PRIMARY KEY ([Id]),
    CONSTRAINT [FK_TraLois_CauHois_QuestionId] FOREIGN KEY ([QuestionId]) REFERENCES [KHAOSAT].[CauHois] ([Id]) ON DELETE CASCADE
);
GO

CREATE TABLE [KHAOSAT].[Responses] (
    [Id] int NOT NULL IDENTITY,
    [SurveyId] int NOT NULL,
    [IDUser] bigint NOT NULL,
    [QuestionId] int NOT NULL,
    [AnswerId] int NOT NULL,
    [HoTen] nvarchar(255) NULL,
    [DiaChi] nvarchar(500) NULL,
    [CreatedAt] datetime2 NOT NULL DEFAULT (GETUTCDATE()),
    CONSTRAINT [PK_Responses] PRIMARY KEY ([Id]),
    CONSTRAINT [FK_Responses_CauHois_QuestionId] FOREIGN KEY ([QuestionId]) REFERENCES [KHAOSAT].[CauHois] ([Id]),
    CONSTRAINT [FK_Responses_KhaoSats_SurveyId] FOREIGN KEY ([SurveyId]) REFERENCES [KHAOSAT].[KhaoSats] ([Id]) ON DELETE CASCADE,
    CONSTRAINT [FK_Responses_TraLois_AnswerId] FOREIGN KEY ([AnswerId]) REFERENCES [KHAOSAT].[TraLois] ([Id])
);
GO

CREATE INDEX [IX_CauHois_SurveyId] ON [KHAOSAT].[CauHois] ([SurveyId]);
GO

CREATE INDEX [IX_Responses_AnswerId] ON [KHAOSAT].[Responses] ([AnswerId]);
GO

CREATE INDEX [IX_Responses_QuestionId] ON [KHAOSAT].[Responses] ([QuestionId]);
GO

CREATE INDEX [IX_Responses_SurveyId_IDUser] ON [KHAOSAT].[Responses] ([SurveyId], [IDUser]);
GO

CREATE INDEX [IX_TraLois_QuestionId] ON [KHAOSAT].[TraLois] ([QuestionId]);
GO

CREATE INDEX [IX_TuLuans_SurveyId] ON [KHAOSAT].[TuLuans] ([SurveyId]);
GO

CREATE INDEX [IX_YKienKhacs_SurveyId] ON [KHAOSAT].[YKienKhacs] ([SurveyId]);
GO

CREATE INDEX [IX_YKienKhacs_UserID] ON [KHAOSAT].[YKienKhacs] ([UserID]);
GO

INSERT INTO [__EFMigrationsHistory] ([MigrationId], [ProductVersion])
VALUES (N'20251212030122_AddKhaoSatSchema', N'8.0.0');
GO

COMMIT;
GO

BEGIN TRANSACTION;
GO

CREATE TABLE [KHAOSAT].[EssayResponses] (
    [Id] int NOT NULL IDENTITY,
    [SurveyId] int NOT NULL,
    [IDUser] bigint NOT NULL,
    [EssayQuestionId] int NOT NULL,
    [Content] nvarchar(max) NOT NULL,
    [CreatedAt] datetime2 NOT NULL DEFAULT (GETUTCDATE()),
    CONSTRAINT [PK_EssayResponses] PRIMARY KEY ([Id]),
    CONSTRAINT [FK_EssayResponses_KhaoSats_SurveyId] FOREIGN KEY ([SurveyId]) REFERENCES [KHAOSAT].[KhaoSats] ([Id]) ON DELETE CASCADE,
    CONSTRAINT [FK_EssayResponses_TuLuans_EssayQuestionId] FOREIGN KEY ([EssayQuestionId]) REFERENCES [KHAOSAT].[TuLuans] ([Id])
);
GO

CREATE INDEX [IX_EssayResponses_EssayQuestionId] ON [KHAOSAT].[EssayResponses] ([EssayQuestionId]);
GO

CREATE INDEX [IX_EssayResponses_SurveyId_IDUser] ON [KHAOSAT].[EssayResponses] ([SurveyId], [IDUser]);
GO

INSERT INTO [__EFMigrationsHistory] ([MigrationId], [ProductVersion])
VALUES (N'20251212040922_AddEssayResponsesToKhaoSat', N'8.0.0');
GO

COMMIT;
GO

BEGIN TRANSACTION;
GO

ALTER TABLE [SERVICES].[Banners] ADD [ThuTu] int NOT NULL DEFAULT 0;
GO

INSERT INTO [__EFMigrationsHistory] ([MigrationId], [ProductVersion])
VALUES (N'20251212075540_AddThuTuToBanners', N'8.0.0');
GO

COMMIT;
GO

BEGIN TRANSACTION;
GO

ALTER TABLE [SERVICES].[Icons] ADD [ThuTu] int NOT NULL DEFAULT 0;
GO

ALTER TABLE [SERVICES].[IconGroups] ADD [ThuTu] int NOT NULL DEFAULT 0;
GO

INSERT INTO [__EFMigrationsHistory] ([MigrationId], [ProductVersion])
VALUES (N'20251212082010_AddThuTuToIconGroupsAndIcons', N'8.0.0');
GO

COMMIT;
GO

