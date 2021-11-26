const Discord = require("discord.js")
const { token } = require("./config.json")
const Langage = require("./langage.json")
const Parametres = require("./parametres.json")
const bot = new Discord.Client({ intents: ["GUILDS", "GUILD_MESSAGES", "DIRECT_MESSAGES", "GUILD_MEMBERS"], partials: ["CHANNEL", "MESSAGE", "VIEW_CHANNEL"] })

/////////////////////////////////////////////////
//                                             //
//               BOT-DISCORD v1.0              //
//                                             //
//   Créé par : https://wltrdr.dev/            //
//                                             //
//   https://discord.com/developers/           //
//   https://discordjs.guide/                  //
//   https://discordapi.com/permissions.html   //
//                                             //
/////////////////////////////////////////////////

const listeServeurs = []
const listeMembres = []
const listeEspions = []
let nomDuBot = "Le bot"

function retourneEntreeRand(arr)
{
    return arr[Math.round(Math.random() * (arr.length - 1))]
}

function mathRamdomMinMax(min, max)
{
    return min + Math.round(Math.random() * (max - min))
}

function consoleLogDate(str)
{
    const ojd = new Date()
    console.log(`${ojd.getDate()}/${(ojd.getMonth()+1)}/${ojd.getFullYear()} @ ${ojd.getHours()}h${ojd.getMinutes()} > ${nomDuBot} ${str} !`)
}

function generePonctuation(str, nbMaxPonctuations = 3)
{
    let ret = ""
    let ponctuation
    let question = false
    if(str[str.length - 1] === "?")
    {
        str = str.substring(0, str.length - 1)
        ponctuation = ["?", "?!"]
        question = true
    }
    else
        ponctuation = ".!"
    if(Math.random() < 0.5 || question)
    {
        ponctuation = retourneEntreeRand(ponctuation)
        if(ponctuation !== "." && Math.random() < 0.5)
            ret += " "
        for(let i = 0; i < Math.round(Math.random() * (nbMaxPonctuations - 1)) + 1; i++)
            ret += ponctuation
    }
    return str + ret
}

/////////////////////////////////////////
//                                     //
//  Fonctions d'objets dans des array  //
//                                     //
/////////////////////////////////////////

function returnObjInArr(arr, val, param = false, insensible = false, returnBoolean = false)
{
    if(typeof param === "boolean")
        param = "id"
    if(insensible === true)
        val = val.toLowerCase()
    let ret = false
    arr.forEach(el => {
        let retTmp = true
        if(returnBoolean === false)
            retTmp = el
        if(insensible === true && el[param].toLowerCase() === val)
            ret = retTmp
        else if(insensible !== true && el[param] === val)
            ret = retTmp
    })
    return ret
}

function removeObjsInArr(arr, val, param = false, insensible = false)
{
    if(typeof param === "boolean")
        param = "id"
    if(insensible === true)
        val = val.toLowerCase()
    for(let i = 0; i < arr.length; i++)
    {
        if(insensible === true && arr[i][param].toLowerCase() === val)
        {
            arr.splice(i, 1)
            i--
        }
        else if(insensible !== true && arr[i][param] === val)
        {
            arr.splice(i, 1)
            i--
        }
    }
}

/////////////////////////
//                     //
//  Activité en cours  //
//                     //
/////////////////////////

const nbJeux = Langage.Jeux.length
const nbFilms = Langage.Films.length

function affMinutes(min)
{
    let ret = ""
    let hrs = Math.floor(min / 60)
    min %= 60
    if(hrs !== 0)
    {
        ret += hrs + " heure"
        if(hrs > 1)
            ret += "s"
    }
    if(min !== 0)
    {
        if(hrs !== 0)
            ret += " et "
        ret += min + " minute"
        if(min > 1)
            ret += "s"
    }
    return ret
}

function lanceActivite(delaiMinProchaine = 3, delaiMaxProchaine = 300)
{
    if(nbJeux !== 0 || nbFilms !== 0)
    {
        let ratioFilms, typeActivite, listeActivites
        if(nbJeux === 0)
            ratioFilms = 1
        else if(nbFilms === 0)
            ratioFilms = 0
        else
            ratioFilms = nbFilms / (nbJeux + nbFilms)
        if(Math.random() < ratioFilms)
        {
            typeActivite =  "WATCHING"
            listeActivites = Langage.Films
            activiteConsole =  "va regarder"
        }
        else
        {
            typeActivite =  "PLAYING"
            listeActivites = Langage.Jeux
            activiteConsole =  "va jouer à"
        }
        const activiteeLancee = retourneEntreeRand(listeActivites)
        bot.user.setActivity(activiteeLancee, { type: typeActivite })
        const dureeActivite = mathRamdomMinMax(delaiMinProchaine * 60 * 1000, delaiMaxProchaine * 60 * 1000)
        setTimeout(() => lanceActivite(Parametres.DelaiMinEntreActivitesMinutes, Parametres.DelaiMaxEntreActivitesMinutes), dureeActivite)
        consoleLogDate(`${activiteConsole} "${activiteeLancee}" pendant ${affMinutes(Math.ceil(dureeActivite / 60 / 1000))}`)
    }
}

///////////////////////////////////
//                               //
//  Rafraichissement des listes  //
//                               //
///////////////////////////////////

function definiSecsAvantReveil()
{
    return mathRamdomMinMax(Parametres.DelaiMinEntreMessagesInactifHeures * 60 * 60 * 1000, Parametres.DelaiMaxEntreMessagesInactifHeures * 60 * 60 * 1000)
}

function refreshListes()
{
    const Guilds = bot.guilds.cache.map(guild => { return { id: guild.id, name: guild.name, members: guild.members } })
    Guilds.forEach(guild => {
        if(!returnObjInArr(listeServeurs, guild.id, false, false, true))
        {
            listeServeurs.push({ id: guild.id, nom: guild.name, tempsInactif: 0, delaiAvantReveil: definiSecsAvantReveil(), listeSalons: [] })
            consoleLogDate(`vient de se connecter au serveur "${guild.name}"`)
        }
        guild.members.fetch().then(members => {
            members.forEach(member =>
            {
                let membreTrouve = false
                let membreBisTrouve = false
                listeMembres.forEach(membre => {
                    if(membre.id === member.user.id && membre.nom === member.user.username)
                        membreTrouve = true
                    if(membre.id === member.user.id && member.nickname != null && membre.nom === member.nickname)
                        membreBisTrouve = true
                })
                if(!membreTrouve)
                    listeMembres.push({id: member.user.id, nom: member.user.username})
                if(!membreBisTrouve && member.nickname != null)
                    listeMembres.push({id: member.user.id, nom: member.nickname})
            })
        })
    })
    for(let i = 0; i < listeServeurs.length; i++)
    {
        if(!returnObjInArr(Guilds, listeServeurs[i].id, false, false, true))
        {
            listeServeurs.splice(i, 1)
            consoleLogDate(`vient de se déconnecter du serveur "${listeServeurs[i].nom}"`)
            i--
        }
    }
}

///////////////////////////////////////
//                                   //
//  Envoi de message en cas d'ennui  //
//                                   //
///////////////////////////////////////

setInterval(() => {
    refreshListes()
    for(let i = 0; i < listeServeurs.length; i++)
    {
        if(listeServeurs[i].tempsInactif > listeServeurs[i].delaiAvantReveil)
        {
            if(listeServeurs[i].listeSalons.length !== 0)
            {
                const salon = retourneEntreeRand(listeServeurs[i].listeSalons)
                try {
                    bot.guilds.cache.get(listeServeurs[i].id).channels.cache.get(salon).send(generePonctuation(retourneEntreeRand(Langage.ReponsesInactif), Parametres.NombrePonctuationsMax))
                    consoleLogDate(`a écrit un message car il s'ennuyait sur le serveur "${listeServeurs[i].nom}"`)
                    listeServeurs[i].tempsInactif = 0
                    listeServeurs[i].delaiAvantReveil = definiSecsAvantReveil()
                }
                catch {
                    listeServeurs[i].listeSalons.splice(listeServeurs[i].listeSalons.indexOf(salon), 1)
                    i--
                }
            }
            else
            {
                consoleLogDate(`s'ennuyait et n'a pas su où écrire un message sur le serveur "${listeServeurs[i].nom}"`)
                listeServeurs[i].tempsInactif = 0
                listeServeurs[i].delaiAvantReveil = definiSecsAvantReveil()
            }
        }
        else
            listeServeurs[i].tempsInactif += Parametres.SecondesInterval
    }
}, Parametres.SecondesInterval * 1000)

/////////////////////////////
//                         //
//  Réponses aux messages  //
//                         //
/////////////////////////////

const listeReponsesPrive = Langage.ReponsesPrive.concat(Langage.ReponsesTous)
const listeReponsesHumain = Langage.ReponsesHumains.concat(Langage.ReponsesTous)
const listeReponsesBot = Langage.ReponsesBots.concat(Langage.ReponsesTous)

function testFromArr(arrRgx, str)
{
    let ret = false
    arrRgx.forEach(rgx => {
        if(rgx.test(str))
            ret = true
    })
    return ret
}

function testFromDeclencheurs(str)
{
    const ret = []
    Langage.Declencheurs.forEach(declencheur => {
        const regexTest = []    
        declencheur.Regex.forEach(regex => {
            regexTest.push(new RegExp(regex[0], regex[1]))
        })
        if(testFromArr(regexTest, str))
            ret.push({ nom: declencheur.Nom, themes: declencheur.Themes })
    })
    return ret
}

function unMsgPublicAetePoste(guild, salon)
{
    listeServeurs.forEach((serveur, i) => {
        if(serveur.id === guild)
        {
            listeServeurs[i].tempsInactif = 0
            if(!serveur.listeSalons.includes(salon))
                listeServeurs[i].listeSalons.push(salon)
        }
    })
}

function repondMessageBot(message, reponse, txtConsole)
{
    try {
        message.reply(reponse)
        consoleLogDate(txtConsole)
    }
    catch {
        consoleLogDate(`n'a pas réussi à satisfaire la demande de l'un de ses supérieurs`)
    }
}

function repondMessage(message, type, listeReponses, txtConsole, probabilite)
{
    setTimeout(() => {
        const reponse = generePonctuation(retourneEntreeRand(listeReponses), Parametres.NombrePonctuationsMax)
        try {
            if(listeReponses.length !== 0 && Math.random() < probabilite)
            {
                if(type == 0)
                {
                    message.channel.send(reponse)
                    consoleLogDate(txtConsole)
                }
                else if(type == 1)
                {
                    message.author.send(reponse)
                    consoleLogDate(txtConsole)
                }
                else
                {
                    message.reply(reponse)
                    consoleLogDate(txtConsole)
                }
            }
        }
        catch {
            consoleLogDate(`n'a pas réussi à répondre a un message`)
        }
    }, mathRamdomMinMax(Parametres.TempsDeReponseMinSecondes * 1000, Parametres.TempsDeReponseMaxSecondes * 1000))
    if(message.guildId != null)
        unMsgPublicAetePoste(message.guildId, message.channelId)
}

bot.on("messageCreate", message => {
    if(message.author.constructor.name != "ClientUser")
    {
        const rgxMsgCmtAider = new RegExp(`Comment peux.tu m.?aider ?\?`, "i")
        const rgxMsgQuePeuxDire = new RegExp(`Que peux.tu me dire ?\?`, "i")
        const rgxMsgServeursConnecte = new RegExp(`Sur quels serveurs es.?tu connect. ?\?`, "i")
        const rgxMsgQuiConnaistu = new RegExp(`Qui connais.tu ?\?`, "i")
        const rgxMsgRenvoiMPs = new RegExp(`Fais.moi suivre tes messages`, "i")
        const rgxMsgRenvoiTousMPs = new RegExp(`Fais.moi suivre tous tes messages`, "i")
        const rgxMsgEnvoiMP = new RegExp(`Envoie[^"]+"(.+)"[^"]+"(.+)"$`, "i")
        if(message.guildId == null && (rgxMsgCmtAider.test(message.content) || rgxMsgQuePeuxDire.test(message.content)))
            repondMessageBot(message, `Je peux te dire :\n\n- Sur quels serveurs je suis connecté\n- Qui je connais\n\nSinon je peux aussi :\n\n- Te faire suivre mes messages\n- Envoyer à "un membre" un "message"`, `vient d'envoyer ce qu'il peut faire pour lui à ${message.author.username}`)
        else if(message.guildId == null && rgxMsgServeursConnecte.test(message.content))
        {
            let msg = `Je suis connecté sur ces serveurs :\n\n`
            listeServeurs.forEach(serveur => {
                msg += `- ${serveur.nom} (id : "${serveur.id}")\n`
            })
            repondMessageBot(message, msg, `vient d'envoyer la liste des serveurs sur lesquels il est connecté à ${message.author.username}`)
        }
        else if(message.guildId == null && rgxMsgQuiConnaistu.test(message.content))
        {
            let nbMsg = 0
            const msg = []
            msg[0] = `Je connais ces personnes :\n\n`
            listeMembres.forEach(membre =>
            {
                let txtMsg = `- ${membre.nom} (id : "${membre.id}")\n`
                if(msg[nbMsg].length + txtMsg.length > 1950)
                {
                    msg[nbMsg] += "...\n"
                    nbMsg++
                    msg[nbMsg] = "...\n" + txtMsg
                }
                else
                    msg[nbMsg] += txtMsg
            })
            msg.forEach((partMsg, i) => {
                repondMessageBot(message, partMsg, `vient d'envoyer la partie ${i + 1}/${msg.length} de la liste des personne qu'il connait à ${message.author.username}`)
            })
        }
        else if(message.guildId == null && (rgxMsgRenvoiMPs.test(message.content) || rgxMsgRenvoiTousMPs.test(message.content)))
        {
            if(!returnObjInArr(listeEspions, message.author.id, false, false, true))
            {
                listeEspions.push({id: message.author.id, nom: message.author.username})
                repondMessageBot(message, `Ok, je te ferais suivre tous mes messages !`, `est maintenant espionné par ${message.author.username}`)
            }
            else
                repondMessageBot(message, `Je te fais déjà suivre tous mes messages !`, `est toujours espionné par ${message.author.username}`)
        }
        else if(message.guildId == null && rgxMsgEnvoiMP.test(message.content))
        {
            const matches = message.content.match(rgxMsgEnvoiMP)
                let idDestinataire = false
                let nomDestinataire
                const rgxNb = new RegExp("^[0-9]+$")
                if(rgxNb.test(matches[1]))
                {
                    nomDestinataire = returnObjInArr(listeMembres, matches[1]).nom
                    if(nomDestinataire)
                        idDestinataire = matches[1]
                }
                else
                {
                    nomDestinataire = matches[1]
                    idDestinataire = returnObjInArr(listeMembres, matches[1], "nom", true).id
                }
                if(idDestinataire)
                {
                    try {
                        bot.users.cache.get(idDestinataire).send(matches[2])
                        repondMessageBot(message, `Ok j'envoie ce message !`, `a envoyé un message privé à ${nomDestinataire} venant de ${message.author.username}`)
                    }
                    catch {
                        removeObjsInArr(listeMembres, idDestinataire)
                        repondMessageBot(message, `Je n'ai pas réussi à envoyer ce message !`, `n'a pas réussi à envoyer à ${nomDestinataire} le message privé venant de ${message.author.username}`)
                    }
                }
                else
                    repondMessageBot(message, `Je n'ai pas compris à qui tu voulais envoyer ce message !`, `n'a pas compris à qui envoyer le message privé venant de ${message.author.username}`)
        }
        else
        {
            if(message.guildId == null)
            {
                for(let i = 0; i < listeEspions.length; i++)
                {
                    try {
                        bot.users.cache.get(listeEspions[i].id).send(`Je viens de recevoir ce message venant de ${message.author.username} (id : "${message.author.id}") :\n\n${message.content}`)
                    }
                    catch {
                        consoleLogDate(`n'est plus espionné par ${listeEspions[i].nom}`)
                        listeEspions.splice(i, 1)
                        i--
                    }
                }
            }
            const resultatDeclencheurs = testFromDeclencheurs(message.content)
            if(resultatDeclencheurs.length !== 0)
            {
                const declencheursConsole = []
                const declencheursThemes = []
                resultatDeclencheurs.forEach(declencheur => {
                    declencheursConsole.push(declencheur.nom)
                    declencheur.themes.forEach(theme => {
                        if(!declencheursThemes.includes(theme))
                            declencheursThemes.push(theme)
                    })
                })
                let listeReponsesThemes = []
                let themesProbabilites = 0
                declencheursThemes.forEach(themeUtilise => {
                    Langage.ReponsesThemes.forEach(themeParcouru => {
                        if(themeParcouru.Theme === themeUtilise)
                        {
                            if(themeParcouru.probabiliteReponse > themesProbabilites)
                                themesProbabilites = themeParcouru.probabiliteReponse
                            listeReponsesThemes = listeReponsesThemes.concat(themeParcouru.Reponses)
                        }
                    })
                })
                if(message.guildId == null)
                    repondMessage(message, 1, listeReponsesThemes, `vient de répondre en privé à ${message.author.username} après avoir entendu parler de "${declencheursConsole.join(", ")}"`, themesProbabilites)
                else if(message.author.bot == true)
                    repondMessage(message, 2, listeReponsesThemes, `vient de s'exprimer sur le serveur "${returnObjInArr(listeServeurs, message.guildId).nom}" après avoir entendu un bot parler de "${declencheursConsole.join(", ")}"`, themesProbabilites)
                else
                    repondMessage(message, 2, listeReponsesThemes, `vient de s'exprimer sur le serveur "${returnObjInArr(listeServeurs, message.guildId).nom}" après avoir entendu parler de "${declencheursConsole.join(", ")}"`, themesProbabilites)
            }
            else if(message.guildId == null)
                repondMessage(message, 1, listeReponsesPrive, `vient de répondre à un message privé de ${message.author.username}`, Parametres.probabiliteReponseMP)
            else if(message.author.bot == true)
                repondMessage(message, 0, listeReponsesBot, `vient de prouver sa répartie face à un autre bot sur le serveur "${returnObjInArr(listeServeurs, message.guildId).nom}"`, Parametres.probabiliteReponseBot)
            else
                repondMessage(message, 0, listeReponsesHumain, `vient de répondre à un message sur le serveur "${returnObjInArr(listeServeurs, message.guildId).nom}"`, Parametres.probabiliteReponseHumain)
        }
    }
})


/////////////////
//             //
//  Connexion  //
//             //
/////////////////

bot.once("ready", () => {
    nomDuBot = bot.user.username
    consoleLogDate(`vient de se connecter à internet`)
    refreshListes()
    lanceActivite(Parametres.DelaiMinEntreActivitesMinutes, Parametres.DelaiMaxEntreActivitesMinutes)
})

bot.login(token)
