import { Injectable } from "@nestjs/common";
import { IFilesServiceUpload } from "./interfaces/files-service.interface";
import { Storage } from "@google-cloud/storage";

@Injectable()
export class FilesService {
  //-------------------------------
  // 파일한장
  // upload({ file }: IFilesServiceUpload): Promise<string> {
  //   const storage = new Storage({
  //     projectId: process.env.GCP_PROJECTID,
  //     keyFilename: process.env.GCP_STORAGE, //암호파일 이름
  //   }).bucket(process.env.GCP_BUCKET);
  //   const result = new Promise<string>((resolve, reject) => {
  //     file
  //       .createReadStream()
  //       .pipe(storage.file(file.filename).createWriteStream({}))

  //       .on("finish", () =>
  //         resolve(
  //           "https://storage.googleapis.com/" +
  //             process.env.GCP_BUCKET +
  //             `/${file.filename}`
  //         )
  //       )
  //       .on("error", () => reject("실패했습니다."));
  //   });
  //   return result;
  // }
  //-------------------------------

  // 파일들
  async upload({ files }: IFilesServiceUpload): Promise<string[]> {
    // console.log(files)

    const waitedFiles = await Promise.all(files);
    console.log(waitedFiles); //[File, file]
    // 1. 파일을 클라우드 스토리지에 저장하는 로직

    // 1-1) 스토리지 셋팅하기
    // const bucket = 'codecamp-storage-ag'
    // const storage = new Storage({
    //     projectId: 'propane-cubist-372212',
    //     keyFilename: '/my-secret/gcp-file-storage.json',
    // }).bucket(bucket)
    // console.log(files)

    // 1-1) 스토리지 셋팅하기
    const bucket = "nemo-v-backend";
    const storage = new Storage({
      projectId: "nemo-v-backend",
      keyFilename: "/my-secret/nemo-v-backend",
    }).bucket(bucket);
    console.log(files);
    // 1-2) 스토리지에 파일 올리기

    // files.map((el) =>
    //     new Promise<string>((resolve, reject) => {
    //         el
    //         .createReadStream()
    //         .pipe(storage.file(el.filename).createWriteStream())
    //         .on('finish',() => resolve(`${bucket}/${el.filename}`))
    //         .on('error',() => reject('실패'))
    //     }),
    // )

    const results = await Promise.all(
      waitedFiles.map(
        (el) =>
          new Promise<string>((resolve, reject) => {
            el.createReadStream()
              .pipe(storage.file(el.filename).createWriteStream())

              .on("finish", () => resolve(`${bucket}/${el.filename}`))
              .on("error", () => reject("실패"));
          })
      )
    );
    // 2. 다운로드URL 브라우저에 돌려주기
    return results;
  }
}
