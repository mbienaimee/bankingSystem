import adminMiddleware from "../middleware/admin.middleware";
import clientModel from "../model/client.model.js";

const clientController = {
    clientCreation: async (req, res) => {
        //generating
        try {
            const newClient = await clientModel.create({
                lastName: req.body.name,
                fastName: req.body.name,
                email: req.body.email,
                age: req.body.age,
                password: req.body.password,
            });
            res.status(200).json({
                success: true,
                message: "Client created successfully",
                client: newClient,
            });
        } catch (error) {
            res.status(500).json({
                success: false,
                message: error.message,
            });
        }
    },
    clientList: async (req, res) => {
        try {
            const clients = await clientModel.find();
            res.status(200).json({
                success: true,
                clients: clients,
            });
        } catch (error) {
            res.status(500).json({
                success: false,
                message: error.message,
            });
        }
    },
}