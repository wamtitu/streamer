const express = require ('express');
const app = express();
const fs = require ('fs');

app.get('/', (req, res)=>{
    res.sendFile(__dirname + '/index.html');
});

app.get('/video', (req, res)=>{
    //video range
    const range = req.header.range;
    console.log(range)

    //video stats
    const videoPath = 'Paradise PD101.mkv';
    const videoSize = fs.statSync(videoPath).size;

    //range parsing
    const chunkSize = 10**6 //1mb
    const start = Number(range.replace(/\D/g, ""));;
    const end = Math.min(start + chunkSize, videoSize-1);

    //content header
    const contentLength = end - start +1;
    const headers = {
        "Content-Range": `bytes ${start}-${end}/${videoSize}`,
        "Accept-Ranges": "bytes",
        "Content-Length": contentLength,
        "Content-Type": "video/mkv",
    }
    //http status for partial content
    res.sendFile(206, headers);

     // create video read stream for this particular chunk
  const videoStream = fs.createReadStream(videoPath, { start, end });

   // Stream the video chunk to the client
   videoStream.pipe(res);
   console.log('video parsed')

});


app.listen(8000, ()=>{
    console.log("listening from port 8000");
});