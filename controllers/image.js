
const handleApiCalls = (req,res)=>{

    // Your PAT (Personal Access Token) can be found in the portal under Authentification
const PAT = process.env.CLARIFAI_PAT;
// Specify the correct user_id/app_id pairings
// Since you're making inferences outside your app's scope
const USER_ID = 'the_lequte';
const APP_ID = 'facedetect';
// Change these to whatever model and image URL you want to use
const MODEL_ID = 'face-detection';
const IMAGE_URL = req.body.input;


///////////////////////////////////////////////////////////////////////////////////
// YOU DO NOT NEED TO CHANGE ANYTHING BELOW THIS LINE TO RUN THIS EXAMPLE
///////////////////////////////////////////////////////////////////////////////////

const { ClarifaiStub, grpc } = require("clarifai-nodejs-grpc");

const stub = ClarifaiStub.grpc();

// This will be used by every Clarifai endpoint call
const metadata = new grpc.Metadata();
metadata.set("authorization", "Key " + PAT);

stub.PostModelOutputs(
    {
        user_app_id: {
            "user_id": USER_ID,
            "app_id": APP_ID
        },
        model_id: MODEL_ID,
       
        inputs: [
            { data: { image: { url: IMAGE_URL, allow_duplicate_url: true } } }
        ]
    },
    metadata,
    (err, response) => {
        if (err) {
            throw new Error(err);
        }

        if (response.status.code !== 10000) {
            throw new Error("Post model outputs failed, status: " + response.status.description);
        }

        return res.json(response);
    }

)
  }

const returnClarifaiRequestOptions=(imageUrl)=>{

    // Your PAT (Personal Access Token) can be found in the portal under Authentification
   const PAT = '1f4ff918d0ff47bab31f2386ac84c446';
   // Specify the correct user_id/app_id pairings
   // Since you're making inferences outside your app's scope
   const USER_ID = 'the_lequte';       
   const APP_ID = 'facedetect';
   // Change these to whatever model and image URL you want to use
   const IMAGE_URL = imageUrl;
  
   
   const raw = JSON.stringify({
    "user_app_id": {
        "user_id": USER_ID,
        "app_id": APP_ID
    },
    "inputs": [
        {
            "data": {
                "image": {
                    "url": IMAGE_URL
                }
            }
        }
    ]
  });
  
  const requestOptions = {
    method: 'POST',
    headers: {
        'Accept': 'application/json',
        'Authorization': 'Key ' + PAT
    },
    body: raw
  };
  
  return requestOptions;
  }

const handleApiCall = (req,res)=>{

 fetch("https://api.clarifai.com/v2/models/" + "face-detection" + "/outputs", returnClarifaiRequestOptions(req.body.input))
 .then(response=>response.json())
 .then(data=>{
    res.json(data);
 })
 .catch(err=>res.status(404).json('no response from clarifia Api call'))
}

const handleImage= (db)=>(req,res)=>{
    const{id} = req.body;
    
    db('users').where('id','=',id)
    .increment('entries', 1)
    .returning('entries')
    .then(entries=>{
        res.json(entries[0].entries)
    })
    .catch(err=>{
        res.status(400).json('unable to get entries')
    })
}

module.exports ={
    handleImage,
    handleApiCall
}