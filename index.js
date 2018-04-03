const express = require("express");
const path = require("path");
const fs = require("fs");

module.exports = function() {

    /**
     * Find the archives in the data dir
     * 
     * @param string dir Filepath to data directroy
     * @return array Returns an array of archives (folders) inside the directory
     */
    this.findArchives = (dir) => {

        let archives = [];

        fs.readdirSync(dir).forEach((file) => {
            if (!file.includes(".")) {
                archives.push(file);
            }
        });

        return archives;
    };

    /**
     * Find JSON files in the specified directory
     * 
     * @param string dir Filepath to directory
     * @return array Returns an array of files (.json) inside the directory
     */
    this.findFiles = (dir) => {
        
        let files = [];

        fs.readdirSync(dir).forEach((file) => {
            if (file.includes(".json")) {
                files.push(file);
            }
        });

        return files;
    };

    /**
     * Return the JSON contents of a file, if it exists
     * 
     * @param string filename Filename to read
     * @return mixed Returns the file JSON content or false if it's not found.
     */
    this.readFile = (filename) => {

        let file = false;
        filename = path.normalize(process.cwd() + '/' + filename);

        if (fs.existsSync(filename)) {
            file = require(filename);
        }
        
        return file;

    }

    /**
     * Create a router for each directory
     * 
     * @param string dir Filepath to data directory
     * @return array Returns an array of routers
     */
    this.createRouters = (dir, data = {}) => {
        
        // Load the dirs
        let archives = this.findArchives(dir);

        // Create a router for each
        let routers = [];

        archives.forEach(archive => {
            let router = express.Router();
            let archiveData = data;
            let archivePath = dir + '/' + archive + '/';
            let archiveView = archive + "-archive";
            let singleView = archive + "-single";

            archiveData.posts = this.findFiles(archivePath);
            archiveData.posts = archiveData.posts.map(post => {
                return this.readFile(archivePath + post);
            });

            router.get("/", (request, response, next) => {
                console.log("data:", archiveData);
                response.render(archive + "-archive", archiveData);
            });

            router.get("/:id", (request, response, next) => {
                let singlePath = dir + '/' + archive + '/' + request.params.id +
                    '.json';
                let singleData = data;
                singleData.post = this.readFile(singlePath);

                response.render(singleView, singleData);
            });

            // Name the router
            router.archiveName = '/' + archive;

            routers.push(router);
        });

        return routers;

    }

};
