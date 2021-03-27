const express = require('express')
let inspect = require('util').inspect;

let Busboy = require('busboy');
const app = express()
const admin = require('firebase-admin');
let path = require('path')
let os = require('os')
let fs = require('fs')
let UUID = require('uuid-v4')
const serviceAccount = require('./serviceAccountKey.json');

admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    storageBucket: "instagram-clone-9dd85.appspot.com/",
    databaseURL: "https://instagram-clone-9dd85-default-rtdb.firebaseio.com"

});

const db = admin.firestore();
let bucket = admin.storage().bucket();

app.get('/posts', (request, response) => {
    response.set('Access-Control-Allow-Origin', '*')
    let posts = []
    db.collection('posts').orderBy('date', 'desc').get().then(snapshot => {
        snapshot.forEach((doc) => {
            posts.push(doc.data())
        });
        response.send(posts)
    });
})
app.post('/createpost', (request, response) => {
    response.set('Access-Control-Allow-Origin', '*')
    let uuid = UUID()
    var busboy = new Busboy({ headers: request.headers });
    let fields = {}
    let fileData = {}
    busboy.on('file', function (fieldname, file, filename, encoding, mimetype) {
        console.log('File [' + fieldname + ']: filename: ' + filename + ', encoding: ' + encoding + ', mimetype: ' + mimetype);
        let filepath = path.join(os.tmpdir(), filename)
        file.pipe(fs.createWriteStream(filepath))
        fileData = { filepath, mimetype }
    });
    busboy.on('field', function (fieldname, val, fieldnameTruncated, valTruncated, encoding, mimetype) {
        fields[fieldname] = val
    });
    busboy.on('finish', function () {
        bucket.upload(
            fileData.filepath, {
            uploadType: 'media',
            metadata: {
                metadata: {
                    contentType: fileData.mimetype,
                    firebaseStorageDownloadTokens: uuid
                }
            }
        },
            (err, uploadedFile) => {
                if (!err) {
                    createDocument(uploadedFile)
                }
            }
        )
        function createDocument(uploadedFile) {
            db.collection('posts').doc(fields.id).set({
                id: fields.id,
                caption: fields.caption,
                location: fields.location,
                date: parseInt(fields.date),
                imageURL: `https://firebasestorage.googleapis.com/v0/b/${bucket.name}/o/${uploadedFile.name}?alt=media&token=${uuid}`
            }).then(() => {
                response.send('post added: ' + fields.id)
            });
        }
    });
    request.pipe(busboy);
})

app.listen(process.env.PORT || 3000)