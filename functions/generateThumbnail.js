
const { Storage } = require("@google-cloud/storage");     // 구글 스토리지를 제공해주지만 import가 안되서 require 불러와서 storage를 import 해준다.
const sharp = require("sharp");                           // sharp를 require 불러와서 import 해준다.
exports.ThumbnailTrigger = async (event, context) => {    // 썸네일트리거 함수를 만든다.         //event는 정보를 받아주는 변수
    if (event.name.includes("thumb/")) return;            // event.name.includes 에 thumb 포함하고있다면 이미 트리거가 작동했다는 뜻이므로 리턴해라. 
    const option = [                                      // otpion에 할당 [  320 - s, 640 - m, 1280 - l  ]
        [320, "s"],                                       // option에 다중 이미지 올렸을때 배열로 받아서 쓰기때문에  배열로 사용
        [640, "m"],                                       // 5번줄 thumb 있으면 이미 있는거여서 종료. thumb없으면 계속 반복되서 조건을 걸어서 종료시키는것
        [1280, "l"],                                     
    ];

    const name = event.name;                              // event.name을 name으로 할당
    const storage = new Storage().bucket(event.bucket);   // bucket: GCP-Cloud Storage에서 업로드된 파일이 저장될 버킷명
    await Promise.all(                                    // 파일이 배열로 들어와서 Promise.all 사용, Promise.all은 프로미스 담긴 배열을 받는다. 배열안에   
                                                          // 과정이 끝날떄까지 기다린다.
    option.map(([size, dir]) => {                         // map함수를 이용해서 option을 축약할수있다.
        return new Promise((resolve, reject) => {         // 프로미스 형식으로 만들어줘라
        storage                                           // 버킷 저장소에서
        .file(name)                                       // 네임으로된 파일을 가져옴 그 파일을 스트림 형식으로 읽어라 
        .createReadStream()                               // stream 형태로 앍을수 있게 만들어주는것.
        .pipe(sharp().resize({ width: size }))            // width 320, 640, 1280 의 사이즈로 바꿔준다.   pipe = 실행해라
        .pipe(storage.file(`thumb/${dir}/${name}`)        // 업로드한 저장소에 thumb/s,m,l/의 폴더에, ${name}이름으로 만들고 저장해라.
        .createWriteStream())                             // Stream 저장해줘
        .on("finish", () => resolve())                    // on을 기준으로 finish일 경우 resolve를 통해 성공했다는것을 알림.
        .on("error", () => reject());                     // on을 기준으로 error일 경우 reject를 사용해서 실패했다는걸 알림.
        }); 
    })
    );
};
