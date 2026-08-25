-- CreateTable
CREATE TABLE `proyectos` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `nombre` VARCHAR(100) NOT NULL,
    `descripcion` TEXT NULL,
    `fechaInicio` DATE NULL,
    `fechaFin` DATE NULL,
    `activo` BOOLEAN NOT NULL DEFAULT true,
    `creadoEn` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `actualizadoEn` DATETIME(3) NOT NULL,

    UNIQUE INDEX `proyectos_nombre_key`(`nombre`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `marcas` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `nombre` VARCHAR(100) NOT NULL,
    `activo` BOOLEAN NOT NULL DEFAULT true,
    `creadoEn` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `actualizadoEn` DATETIME(3) NOT NULL,

    UNIQUE INDEX `marcas_nombre_key`(`nombre`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `unidades_medida` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `nombre` VARCHAR(50) NOT NULL,
    `simbolo` VARCHAR(20) NOT NULL,
    `activo` BOOLEAN NOT NULL DEFAULT true,
    `creadoEn` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `actualizadoEn` DATETIME(3) NOT NULL,

    UNIQUE INDEX `unidades_medida_nombre_key`(`nombre`),
    UNIQUE INDEX `unidades_medida_simbolo_key`(`simbolo`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `articulos` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `codigo` VARCHAR(50) NULL,
    `nombre` VARCHAR(100) NOT NULL,
    `especificaciones` TEXT NULL,
    `marcaId` INTEGER NOT NULL,
    `unidadMedidaId` INTEGER NOT NULL,
    `activo` BOOLEAN NOT NULL DEFAULT true,
    `creadoEn` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `actualizadoEn` DATETIME(3) NOT NULL,

    UNIQUE INDEX `articulos_codigo_key`(`codigo`),
    INDEX `articulos_marcaId_idx`(`marcaId`),
    INDEX `articulos_unidadMedidaId_idx`(`unidadMedidaId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `entradas` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `folioFactura` VARCHAR(50) NULL,
    `folioRequisicion` VARCHAR(50) NULL,
    `fechaRecepcion` DATETIME(3) NOT NULL,
    `proveedor` VARCHAR(150) NULL,
    `distribuidor` VARCHAR(150) NULL,
    `observaciones` TEXT NULL,
    `estado` ENUM('ACTIVO', 'ANULADO') NOT NULL DEFAULT 'ACTIVO',
    `creadoPorId` INTEGER NOT NULL,
    `creadoEn` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `actualizadoEn` DATETIME(3) NOT NULL,

    INDEX `entradas_creadoPorId_idx`(`creadoPorId`),
    INDEX `entradas_fechaRecepcion_idx`(`fechaRecepcion`),
    INDEX `entradas_folioFactura_idx`(`folioFactura`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `entrada_detalles` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `entradaId` INTEGER NOT NULL,
    `proyectoId` INTEGER NOT NULL,
    `articuloId` INTEGER NOT NULL,
    `cantidad` DECIMAL(18, 3) NOT NULL,
    `creadoEn` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    INDEX `entrada_detalles_proyectoId_idx`(`proyectoId`),
    INDEX `entrada_detalles_articuloId_idx`(`articuloId`),
    UNIQUE INDEX `entrada_detalles_entradaId_proyectoId_articuloId_key`(`entradaId`, `proyectoId`, `articuloId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `salidas` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `folio` VARCHAR(50) NOT NULL,
    `proyectoId` INTEGER NOT NULL,
    `fecha` DATETIME(3) NOT NULL,
    `responsable` VARCHAR(150) NULL,
    `observaciones` TEXT NULL,
    `estado` ENUM('ACTIVO', 'ANULADO') NOT NULL DEFAULT 'ACTIVO',
    `creadoPorId` INTEGER NOT NULL,
    `creadoEn` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `actualizadoEn` DATETIME(3) NOT NULL,

    UNIQUE INDEX `salidas_folio_key`(`folio`),
    INDEX `salidas_proyectoId_idx`(`proyectoId`),
    INDEX `salidas_fecha_idx`(`fecha`),
    INDEX `salidas_creadoPorId_idx`(`creadoPorId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `salida_detalles` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `salidaId` INTEGER NOT NULL,
    `articuloId` INTEGER NOT NULL,
    `cantidad` DECIMAL(18, 3) NOT NULL,
    `creadoEn` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    INDEX `salida_detalles_articuloId_idx`(`articuloId`),
    UNIQUE INDEX `salida_detalles_salidaId_articuloId_key`(`salidaId`, `articuloId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `devoluciones` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `folio` VARCHAR(50) NOT NULL,
    `salidaId` INTEGER NOT NULL,
    `fecha` DATETIME(3) NOT NULL,
    `motivo` TEXT NOT NULL,
    `estado` ENUM('ACTIVO', 'ANULADO') NOT NULL DEFAULT 'ACTIVO',
    `creadoPorId` INTEGER NOT NULL,
    `creadoEn` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `actualizadoEn` DATETIME(3) NOT NULL,

    UNIQUE INDEX `devoluciones_folio_key`(`folio`),
    INDEX `devoluciones_salidaId_idx`(`salidaId`),
    INDEX `devoluciones_fecha_idx`(`fecha`),
    INDEX `devoluciones_creadoPorId_idx`(`creadoPorId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `devolucion_detalles` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `devolucionId` INTEGER NOT NULL,
    `salidaDetalleId` INTEGER NOT NULL,
    `cantidad` DECIMAL(18, 3) NOT NULL,
    `creadoEn` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    INDEX `devolucion_detalles_salidaDetalleId_idx`(`salidaDetalleId`),
    UNIQUE INDEX `devolucion_detalles_devolucionId_salidaDetalleId_key`(`devolucionId`, `salidaDetalleId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `inventario_almacen` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `articuloId` INTEGER NOT NULL,
    `cantidadActual` DECIMAL(18, 3) NOT NULL DEFAULT 0,
    `actualizadoEn` DATETIME(3) NOT NULL,

    UNIQUE INDEX `inventario_almacen_articuloId_key`(`articuloId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `inventario_proyecto` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `proyectoId` INTEGER NOT NULL,
    `articuloId` INTEGER NOT NULL,
    `cantidadActual` DECIMAL(18, 3) NOT NULL DEFAULT 0,
    `actualizadoEn` DATETIME(3) NOT NULL,

    INDEX `inventario_proyecto_articuloId_idx`(`articuloId`),
    UNIQUE INDEX `inventario_proyecto_proyectoId_articuloId_key`(`proyectoId`, `articuloId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `auditorias` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `usuarioId` INTEGER NOT NULL,
    `accion` VARCHAR(50) NOT NULL,
    `entidad` VARCHAR(100) NOT NULL,
    `entidadId` INTEGER NULL,
    `descripcion` TEXT NULL,
    `datos` JSON NULL,
    `creadoEn` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    INDEX `auditorias_usuarioId_idx`(`usuarioId`),
    INDEX `auditorias_entidad_entidadId_idx`(`entidad`, `entidadId`),
    INDEX `auditorias_creadoEn_idx`(`creadoEn`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `articulos` ADD CONSTRAINT `articulos_marcaId_fkey` FOREIGN KEY (`marcaId`) REFERENCES `marcas`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `articulos` ADD CONSTRAINT `articulos_unidadMedidaId_fkey` FOREIGN KEY (`unidadMedidaId`) REFERENCES `unidades_medida`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `entradas` ADD CONSTRAINT `entradas_creadoPorId_fkey` FOREIGN KEY (`creadoPorId`) REFERENCES `usuarios`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `entrada_detalles` ADD CONSTRAINT `entrada_detalles_entradaId_fkey` FOREIGN KEY (`entradaId`) REFERENCES `entradas`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `entrada_detalles` ADD CONSTRAINT `entrada_detalles_proyectoId_fkey` FOREIGN KEY (`proyectoId`) REFERENCES `proyectos`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `entrada_detalles` ADD CONSTRAINT `entrada_detalles_articuloId_fkey` FOREIGN KEY (`articuloId`) REFERENCES `articulos`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `salidas` ADD CONSTRAINT `salidas_proyectoId_fkey` FOREIGN KEY (`proyectoId`) REFERENCES `proyectos`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `salidas` ADD CONSTRAINT `salidas_creadoPorId_fkey` FOREIGN KEY (`creadoPorId`) REFERENCES `usuarios`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `salida_detalles` ADD CONSTRAINT `salida_detalles_salidaId_fkey` FOREIGN KEY (`salidaId`) REFERENCES `salidas`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `salida_detalles` ADD CONSTRAINT `salida_detalles_articuloId_fkey` FOREIGN KEY (`articuloId`) REFERENCES `articulos`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `devoluciones` ADD CONSTRAINT `devoluciones_salidaId_fkey` FOREIGN KEY (`salidaId`) REFERENCES `salidas`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `devoluciones` ADD CONSTRAINT `devoluciones_creadoPorId_fkey` FOREIGN KEY (`creadoPorId`) REFERENCES `usuarios`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `devolucion_detalles` ADD CONSTRAINT `devolucion_detalles_devolucionId_fkey` FOREIGN KEY (`devolucionId`) REFERENCES `devoluciones`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `devolucion_detalles` ADD CONSTRAINT `devolucion_detalles_salidaDetalleId_fkey` FOREIGN KEY (`salidaDetalleId`) REFERENCES `salida_detalles`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `inventario_almacen` ADD CONSTRAINT `inventario_almacen_articuloId_fkey` FOREIGN KEY (`articuloId`) REFERENCES `articulos`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `inventario_proyecto` ADD CONSTRAINT `inventario_proyecto_proyectoId_fkey` FOREIGN KEY (`proyectoId`) REFERENCES `proyectos`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `inventario_proyecto` ADD CONSTRAINT `inventario_proyecto_articuloId_fkey` FOREIGN KEY (`articuloId`) REFERENCES `articulos`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `auditorias` ADD CONSTRAINT `auditorias_usuarioId_fkey` FOREIGN KEY (`usuarioId`) REFERENCES `usuarios`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
