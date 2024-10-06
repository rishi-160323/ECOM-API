import UserModel from "../features/user/user.model.js";

const basicAuthrizer = (req, res, next)=>{
//1. Check is authrizer header is empty.
// The user credentials will come into the http headers. Header is an array you can send multiple at a time vice versa b/w client to server.
const authHeader = req.headers["authorization"]

if(!authHeader){
    return res.status(401).send("No autherization details found.");
}

//2. Extract credentials. which comes in base64 encoded--> [Basic lvheh2yt70u0332r0]
const base64Credentials = authHeader.replace('Basic ', '');

//3. Decode credentials.
const decodedCreds = Buffer.from(base64Credentials, 'base64').toString('utf8');
// decodedCreds--> [username:password]
const credes = decodedCreds.split(':');
console.log(credes);

const user = UserModel.getAll().find(u=> u.email==credes[0] && u.password==credes[1]);

if(user){
    next();
}else{
    return res.status(401).send("Imcorrect Credentials.");
}

}

export default basicAuthrizer;