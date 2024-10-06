import UserModel from "./user.model.js";
import jwt from 'jsonwebtoken';
import UserRepository from '../user/user.repository.js'
import bcrypt from 'bcrypt';

export default class UserController {

    constructor() {
        this.userRepository = new UserRepository();
    }

    async resetPassword(req, res) {
        const { newPassword } = req.body;
        const hashedNewPassword = await bcrypt.hash(newPassword, 12);
        const userID = req.userID;
        try {
            await this.userRepository.resetPassword(userID, hashedNewPassword);
        } catch (err) {
            console.log(err);
            console.log("Passinh error to middleware.")
            next(err);
        }

    }


    async signUp(req, res) {
        const { name, email, password, type } = req.body;
        const hashedPassword = await bcrypt.hash(password, 12);
        const newUser = new UserModel(name, email, hashedPassword, type);
        await this.userRepository.signUp(newUser);
        res.status(201).send(newUser);
    }

    async signIn(req, res) {
        try {
            const user = await this.userRepository.findByEmail(req.body.email);
            if (!user) {
                return res.status(400).send("Incorrect Credentials");
            }
            const authenticated = await bcrypt.compare(req.body.password, user.password);

            if (authenticated) {
                // 1. Create token.
                const token = jwt.sign({ userID: user._id, email: user.email }, process.env.JWT_SECRET, { expiresIn: '1h' });

                // 2. Send token.
                return res.status(200).send(token);
            }
        } catch (error) {
            console.log(error);
            return res.status(200).send("Something went wrong...!");
        }

    }
}