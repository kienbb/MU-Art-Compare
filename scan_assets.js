const fs = require('fs');
const path = require('path');

const assetsDir = path.join(__dirname, 'assets');
const outputDir = path.join(__dirname, 'public');
const outputFile = path.join(outputDir, 'data.json');
const gameVersions = ['MU_Awaken', 'MU_Origin'];
const categories = ['Map', 'NPC', 'Monster', 'Outfit'];

function getItemIdAndName(folderName) {
    const match = folderName.match(/^(\d+)_?(.*)$/);
    if (match) {
        return { id: match[1], name: match[2].replace(/_/g, ' ') || `Item ${match[1]}` };
    }
    // Fallback if no ID prefix is found (treat whole name as name)
    return { id: null, name: folderName.replace(/_/g, ' ') };
}

function scanAssets() {
    const data = {
        categories: {}
    };

    // Debug: Log directories structure
    console.log('Starting asset scan...');
    try {
        if (!fs.existsSync(assetsDir)) {
            console.warn(`Assets directory not found at: ${assetsDir}`);
            fs.mkdirSync(assetsDir, { recursive: true });
            gameVersions.forEach(version => {
                categories.forEach(category => {
                    fs.mkdirSync(path.join(assetsDir, version, category), { recursive: true });
                });
            });
            console.log('Created default directory structure.');
        }
    } catch (err) {
        console.error(`Error checking/creating asset directory: ${err.message}`);
    }

    categories.forEach(category => {
        data.categories[category] = [];
        const items = new Map();

        gameVersions.forEach(version => {
            const categoryPath = path.join(assetsDir, version, category);
            console.log(`Checking category path: ${categoryPath}`);
            
            if (fs.existsSync(categoryPath)) {
                try {
                    const itemFolders = fs.readdirSync(categoryPath, { withFileTypes: true })
                                          .filter(dirent => dirent.isDirectory())
                                          .map(dirent => dirent.name);

                    console.log(`Found ${itemFolders.length} items in ${version}/${category}: ${itemFolders.join(', ')}`);

                    itemFolders.forEach(itemFolder => {
                        const { id, name } = getItemIdAndName(itemFolder);
                        console.log(`Processing item: ${itemFolder} (ID: ${id}, Name: ${name})`);
                        
                        const itemKey = `${category}_${itemFolder}`;
                        const itemPath = path.join(categoryPath, itemFolder);
                        let imageFiles = [];
                        let modelFiles = [];
                        try {
                             const allFiles = fs.readdirSync(itemPath);
                             
                             // Process image files
                             imageFiles = allFiles
                                .filter(file => /\.(jpg|jpeg|png|gif|webp)$/i.test(file))
                                .map(file => `https://raw.githubusercontent.com/kienbb/MU-Art-Compare/main/assets/${version}/${category}/${itemFolder}/${file}`);
                             
                             // Process 3D model files
                             modelFiles = allFiles
                                .filter(file => /\.(fbx|glb|gltf)$/i.test(file))
                                .map(file => `https://raw.githubusercontent.com/kienbb/MU-Art-Compare/main/assets/${version}/${category}/${itemFolder}/${file}`);
                             
                             console.log(`Found ${imageFiles.length} images and ${modelFiles.length} 3D models for ${itemFolder}`);
                        } catch (imgError) {
                            console.warn(`Could not read files in ${itemPath}: ${imgError.message}`);
                        }

                        if (!items.has(itemKey)) {
                            items.set(itemKey, {
                                id: id,
                                name: name,
                                folderName: itemFolder,
                                category: category,
                                images: {
                                    awaken: [],
                                    origin: []
                                },
                                models: {
                                    awaken: [],
                                    origin: []
                                }
                            });
                        }

                        const currentItem = items.get(itemKey);
                        if (version === 'MU_Awaken') {
                            currentItem.images.awaken = imageFiles;
                            currentItem.models.awaken = modelFiles;
                        } else if (version === 'MU_Origin') {
                            currentItem.images.origin = imageFiles;
                            currentItem.models.origin = modelFiles;
                        }
                    });
                } catch (err) {
                     console.error(`Error reading directory ${categoryPath}: ${err.message}`);
                }
            } else {
                console.warn(`Category path does not exist: ${categoryPath}`);
            }
        });

        data.categories[category] = Array.from(items.values());
        console.log(`Total items in ${category}: ${data.categories[category].length}`);
         
        data.categories[category].sort((a, b) => {
            const idA = parseInt(a.id, 10);
            const idB = parseInt(b.id, 10);
            if (!isNaN(idA) && !isNaN(idB)) {
                return idA - idB;
            }
            if (!isNaN(idA) && isNaN(idB)) return -1;
            if (isNaN(idA) && !isNaN(idB)) return 1;
            return a.name.localeCompare(b.name);
        });
    });

    try {
        if (!fs.existsSync(outputDir)) {
            fs.mkdirSync(outputDir, { recursive: true });
        }
        fs.writeFileSync(outputFile, JSON.stringify(data, null, 2));
        console.log(`Successfully generated ${outputFile}`);
    } catch (err) {
        console.error(`Error writing ${outputFile}: ${err.message}`);
    }
}

// Run the scan
scanAssets(); 