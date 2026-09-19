import cloudniary from '../config/cloudinaryConfig.js'

const uploadToCloudinary  =(buffer, folderName)=>{
    return new Promise(( resolve  , reject)=>{
 const uploadStream = cloudniary.uploader.upload_stream( {
        folder: folderName,
      },
        (error, result) => {
        if (error) {
          reject(error);
        } else {
          resolve(result);
        }
      }
    );

    uploadStream.end(buffer);
  });
    
}
export default uploadToCloudinary;