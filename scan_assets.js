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
        const items = new Map(); // Use a Map to collect items across versions

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
                        
                        // Use full folder name as part of the key to avoid collisions with same ID
                        const itemKey = `${category}_${itemFolder}`; 
                        const itemPath = path.join(categoryPath, itemFolder);
                        let imageFiles = [];
                        try {
                             imageFiles = fs.readdirSync(itemPath)
                                               .filter(file => /\.(jpg|jpeg|png|gif|webp)$/i.test(file))
                                               // Use forward slashes for web paths
                                               .map(file => `assets/${version}/${category}/${itemFolder}/${file}`);
                             console.log(`Found ${imageFiles.length} images for ${itemFolder}`);
                        } catch (imgError) {
                            console.warn(`Could not read images in ${itemPath}: ${imgError.message}`);
                        }

                        if (!items.has(itemKey)) {
                            items.set(itemKey, {
                                id: id,
                                name: name,
                                folderName: itemFolder, // Keep original folder name if needed
                                category: category,
                                images: {
                                    awaken: [],
                                    origin: []
                                }
                            });
                        }

                        const currentItem = items.get(itemKey);
                        if (version === 'MU_Awaken') {
                            currentItem.images.awaken = imageFiles;
                        } else if (version === 'MU_Origin') {
                            currentItem.images.origin = imageFiles;
                        }
                    });
                } catch (err) {
                     console.error(`Error reading directory ${categoryPath}: ${err.message}`);
                }
            } else {
                console.warn(`Category path does not exist: ${categoryPath}`);
            }
        });

        // Convert Map values to array for the category
        data.categories[category] = Array.from(items.values());
        console.log(`Total items in ${category}: ${data.categories[category].length}`);
         
        // Sort items within the category, by ID if available, otherwise by name
        data.categories[category].sort((a, b) => {
            const idA = parseInt(a.id, 10);
            const idB = parseInt(b.id, 10);
            if (!isNaN(idA) && !isNaN(idB)) {
                return idA - idB;
            }
            if (!isNaN(idA) && isNaN(idB)) return -1; // IDs come before non-IDs
            if (isNaN(idA) && !isNaN(idB)) return 1;  // Non-IDs come after IDs
            return a.name.localeCompare(b.name); // Fallback to name sort
        });
    });

    try {
         // Ensure the output directory exists
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