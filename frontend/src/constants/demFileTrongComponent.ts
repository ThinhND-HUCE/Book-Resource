export const getFrontendSectionPath = (backendFolderPath: string): string | null => {
    const normalized = backendFolderPath.replace(/\\/g, "/");
    console.log(normalized)
    // ✅ Tách đúng phần SAU chữ "Resource/"
    const keyword = "Resource/"
    const index = normalized.lastIndexOf(keyword);

    if (index === -1) return null;

    return normalized.substring(index + keyword.length);
};

export const getExerciseLoadersWithDescription = async (backendFolderPath: string) => {
    const relativePath = getFrontendSectionPath(backendFolderPath);
    if (!relativePath) return [];

    const allFiles = import.meta.glob('/src/components/**/*.tsx');

    const matched = Object.entries(allFiles).filter(([path]) => {
        const normalizedPath = path.replace(/\\/g, "/");
        return normalizedPath.includes(`/src/components/${relativePath}/`);
    });

    const result = await Promise.all(
        matched.map(async ([, loader]) => {
            const mod = await loader() as {
                default: React.ComponentType<any>;
                exerciseMeta?: { label: string };
            };

            const label = mod.exerciseMeta?.label || 'Không có mô tả';

            const componentLoader = () =>
                loader().then(m => (m as { default: React.ComponentType<any> }).default);

            return { label, componentLoader };
        })
    );

    return result;
};
