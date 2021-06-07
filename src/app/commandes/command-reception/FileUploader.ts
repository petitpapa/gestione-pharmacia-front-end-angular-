export class FileUploaderUtils {
    /**
      * on file drop handler
      */
    static onFileDropped($event) {
        this.prepareFilesList($event);
    }

    /**
       * handle file from browsing
       */
    static fileBrowseHandler(files) {
        this.prepareFilesList(files);
    }

    /**
       * Delete file from files list
       * @param index (File index)
       */
    static deleteFile(files: Array<any>, index: number) {
        if (files[index].progress === 100)
            files.splice(index, 1);
    }

    /**
       * Simulate the upload process
       */
    static uploadFilesSimulator(files: Array<any>, index: number) {
        setTimeout(() => {
            if (index === files.length) {
                return;
            } else {
                const progressInterval = setInterval(() => {
                    if (files[index].progress === 100) {
                        clearInterval(progressInterval);
                        this.uploadFilesSimulator(files, index + 1);
                    } else {
                        files[index].progress += 5;
                    }
                }, 200);
            }
        }, 1000);
    }

    /**
       * Convert Files list to normal array list
       * @param files (Files List)
       */
    static prepareFilesList(files: Array<any>) {
        for (const item of files) {
            item.progress = 0;
            files.push(item);
        }
        this.uploadFilesSimulator(files, 0);
    }

    static toBase64 = file => new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => resolve(reader.result);
        reader.onerror = error => reject(error);
    })
}