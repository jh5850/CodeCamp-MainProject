import { Args, Mutation, Resolver } from "@nestjs/graphql";
import { FileUpload, GraphQLUpload } from "graphql-upload";
import { FilesService } from "./files.service";

@Resolver()
export class FilesResolver {
  constructor(
    private readonly filesService: FilesService //
  ) {}
  //-------------------------------
  // 파일한장
  // @Mutation(() => String)
  // uploadFile(
  //     @Args({name:'file', type: () => GraphQLUpload }) file: FileUpload
  //     ): Promise<string> {
  //         return this.filesService.upload({ file })
  // }
  //-------------------------------

  //파일들
  @Mutation(() => [String])
  uploadFile(
    @Args({ name: "files", type: () => [GraphQLUpload] }) files: FileUpload[]
  ): Promise<string[]> {
    return this.filesService.upload({ files });
  }
}
