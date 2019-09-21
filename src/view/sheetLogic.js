
sheetProj.view.sheetLogic = {
  setupUserInterface: function () {

    }
};



let setUp={
  croptypeChange:function(cropType){
    data.settings.cropType=cropType;
    $("#resultBox").html("");
    $("#urlInput").val("");
  }
}

let drawImg={
  urlToCrop:function(newURL){
    let resultHTML="";
    resultHTML+=`<canvas class="canvasResult" id="canvas0" width="500" height="380"></canvas>`;


    $("#resultBox").html(resultHTML);
    drawImg.drawToCanvas($("#canvas0")[0], newURL);
  },
  filesToCrop:function(event){
    console.log(event.target.files);
    let fileList=event.target.files;
    let resultHTML="";


    Array.from(fileList).forEach((file, index)=>{
      resultHTML+=`<canvas class="canvasResult" id="canvas${index}" width="500" height="380"></canvas>`;
    });

    $("#resultBox").html(resultHTML);

    Array.from(fileList).forEach((file, index)=>{
      let fileURL=URL.createObjectURL(event.target.files[index]);
      drawImg.drawToCanvas($(`#canvas${index}`)[0], fileURL);
    });


  },
  drawToCanvas:function(canvas, imgURL){
    // http://jsfiddle.net/bozdoz/TB9rX/

    let promisedItems=[
      new Promise(function (resolve, reject){
        const img = new Image();
        img.onload = () => resolve(img);
        img.onerror = () => resolve(false);

        img.src = imgURL;
      })
   ];





    Promise.all([...promisedItems]).then(
      function(img){
        // let canvas = $("#cardCanvas")[0];
        console.log(canvas);
        let ctx = canvas.getContext('2d');
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        canvas.crossOrigin = "Anonymous";
        ctx.textBaseline = "middle";
        ctx.textAlign = "center";

        //load images THEN draw images
        console.log(img);
        for (let i=0; i<img.length; i++){
          if (img[i]){
            console.log("drawing?");
            console.log(canvas.width);
            console.log(canvas.height);
            ctx.drawImage(img[i], 0, 0, img[i].width,    img[i].height,     // source rectangle
                   0, 0, canvas.width, canvas.height); // destination rectangle
          }

        }

        ctx.globalCompositeOperation = 'destination-in';
        console.log(canvas.width);
        console.log(canvas.height);
        if (data.settings.cropType=="skill"){
          // var path = [0, 0, 100,  0, 100 , 79, 68, 100, 32, 100, 0, 79];
          let path=[0, 0, 100, 0, 100, 80, 60, 98, 40, 98, 0, 80];

          var w = ctx.canvas.width,
              h = ctx.canvas.height;

              ctx.beginPath();
              ctx.moveTo(path[0] * w / 100, path[1] * h / 100);
              for(var i = 2; i < path.length; i+=2) {
                  ctx.lineTo(path[i] * w / 100, path[i+1] * h / 100);
              }
              ctx.closePath();
              ctx.fill();
        }
        else if(data.settings.cropType=="power"){

          // 60 degree circlectx.beginPath();
          ctx.beginPath();
          ctx.ellipse(250, 142, 259, 229, 0, 0, Math.PI*2);
          ctx.fill();
        }


        URL.revokeObjectURL(imgURL)

    }).catch(function(err) {
      console.log(err); // some coding error in handling happened
    });;

  }
}
