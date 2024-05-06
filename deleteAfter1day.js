const fs = require('fs');
const path = require('path');
const CronJob = require('cron').CronJob;

// Function to delete files older than a specified age
async function deleteOldFiles(folderPath, maxAgeInMilliseconds) {
    try {
        console.log("waiting")
        const files = await fs.promises.readdir(folderPath);

        for (const file of files) {
            const filePath = path.join(folderPath, file);
            const stats = await fs.promises.stat(filePath);

            // Calculate file age
            const fileAge = Date.now() - stats.birthtime.getTime();

            // Delete file if it exceeds the maximum age
            if (fileAge > maxAgeInMilliseconds) {
                await fs.promises.unlink(filePath);
                console.log(`Deleted file: ${filePath}`);
            }
        }
    } catch (error) {
        console.error('Error deleting old files:', error);
    }
}

         // Schedule cleanup task to run every day

         const cleanupJob = new CronJob('0 0 * * *', async () => {
            const folderPath = path.join(__dirname, 'Warnings');
            const maxAgeInMilliseconds = 24 * 60 * 60 * 1000; // 1 day
            await deleteOldFiles(folderPath, maxAgeInMilliseconds);
        }, null, true, 'UTC');
        
        cleanupJob.start();

module.exports={deleteOldFiles}