const db = require("./db")
const {Umzug, SequelizeStorage} = require("umzug")
const sequelize = db.sequelize
const express = require("express")
const middlewares = require("./middlewares")
const Joi = require('joi')

const app = express()

app.use(express.json())
app.use(middlewares.jsonParseExeptionMiddleWare)

const User = require("./migrations/user").User

app.post("/balance", async (req, res)=> {
    const schema = Joi.object({
        transactionType: Joi.string().valid("deposit", "withdrawal").required(),
        userId: Joi.number().integer().min(1).required(),
        amount: Joi.number().integer().min(1).required(),
    })


    let data
    try {
        data  = await schema.validateAsync(req.body)
    } catch (e){
         return res.status(406).json({
            message: e
        })
    }

    const userRef = await User.findOne({
        where:{
            id : data.userId
        }
    })

    if (userRef === null){
         return res.status(404).json({
            message: "Could not find user"
        })
    }



    if  (data.transactionType === "deposit"){
        await userRef.increment({
            balance: data.amount
        })
    } else if (data.transactionType === "withdrawal"){

        if (userRef.balance - data.amount < 0){
            return res.status(403).json({
                message: "not sufficient balance"
            })
        }
        
        await userRef.decrement({
            balance: data.amount
        })
    }
    
    res.json({status: "ok"})
})



const  umzug = new Umzug({
    migrations: {glob: "migrations/*.js"},
    context: sequelize.getQueryInterface(),
    storage: new SequelizeStorage({sequelize}),
    logger: console
});




app.listen(8000, async ()=>{

    await umzug.up()
    console.log("app listen on port 8000")

})


