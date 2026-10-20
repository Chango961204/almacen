-- El nombre de un proyecto ya no es único en la base de datos.
-- La unicidad se valida en la capa de servicio únicamente entre
-- proyectos activos, para poder crear un proyecto nuevo con el
-- nombre de uno que fue eliminado (soft delete).
DROP INDEX `proyectos_nombre_key` ON `proyectos`;
