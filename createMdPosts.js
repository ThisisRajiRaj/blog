

var dateFormat = require('dateformat');
var fs = require('fs');

writeMdPosts()
function writeMdPosts () {
    fs.readFile('./posts/articleIndex.json', 'utf8', (err, jsonString) => {
        if (err) {
            console.log("Article Json Index file read failed:", err)
            return
        }    

        try {
            const articles = JSON.parse(jsonString)
            articles
            .filter (item => {return item.name !== "test.md"})
            .forEach((item) => {
                writeFrontMatterIntoHtml(item)
                writeSingleArticleMdPost(item)
            })
        } catch(err) {
            console.log('Error parsing Article Index JSON string:', err)
        }

    })
}

function writeFrontMatterIntoHtml (item) {
    var fileName = './posts/' + item.name + ".html"
    fs.readFile(fileName, 'utf8', (err, fileText) => {
        if (err) {
            console.log("Post html file read failed:", err)
            return
        } 
        var text = `
---
layout: post
---
        `   
        if (fileText.startsWith("---")) {
            return
        }
        fs.writeFile(fileName, text.trim() + "\n" + fileText, function(err) {
            if (err) {
                console.log(err);
            }
        })
    })
}

function writeSingleArticleMdPost (item) {
    const date = new Date(item.date)
    const fileName = dateFormat(date,"yyyy-mm-dd-")+ item.name +".md"
    var text = `
---
layout:       post
title:        "${item.title}"
url:          "/posts/${item.name}.html"
canonical_url: "/posts/${item.name}.html"
redirect_to: /posts/${item.name}.html
---`
    fs.writeFile("./_posts/" + fileName, text.trim(), function(err) {
        if (err) {
            console.log(err);
        }
    })
}