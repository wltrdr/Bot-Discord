
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
    //   Environnement :                           //
    //    - Node.JS v16                            //
    //    - Discord.JS v13                         //
    //                                             //
    /////////////////////////////////////////////////



Configuration :
---------------

    Renseigner le token du bot dans le fichier config.json

    Configurer le fichiers parametres.json (infos ci-dessous)

    Configurer le fichier langage.json selon le vocabulaire souhaité pour le bot



Connexion à un serveur :
------------------------

    https://discord.com/oauth2/authorize?client_id=CLIENT_ID_DU_BOT&scope=bot



Paramètres :
------------

    NombrePonctuationsMax : Nombre maximum de caractères de ponctuation ajoutés après les réponses

    probabiliteReponseMP : Probabilité (entre 0 et 1) que le bot réponde à un MP qu'on lui a envoyé

    probabiliteReponseHumain : Probabilité (entre 0 et 1) que le bot réponde à un message public posté par un humain

    probabiliteReponseBot : Probabilité (entre 0 et 1) que le bot réponde à un message public posté par un bot

    TempsDeReponseMinSecondes : Nombre minimum de secondes que le bot prend pour répondre à un message

    TempsDeReponseMaxSecondes : Nombre maximum de secondes que le bot prend pour répondre à un message

    DelaiMinEntreActivitesMinutes : Nombre minimum de minutes que durent les activités lancées par le bot

    DelaiMaxEntreActivitesMinutes : Nombre maximum de minutes que durent les activités lancées par le bot

    DelaiMinEntreMessagesInactifHeures : Nombre minimum d'heures d'inactivité sur un serveur avant que le bot y poste quelque chose

    DelaiMaxEntreMessagesInactifHeures : Nombre maximum d'heures d'inactivité sur un serveur avant que le bot y poste quelque chose

    SecondesInterval : Nombre de secondes entre chaques re-vérifications des serveurs sur lesquels est le bot et leurs membres connectés



Commandes à envoyer en MP au bot :
----------------------------------

    Pour recevoir cette liste : Comment peux-tu m'aider ? / Que peux-tu me dire ?

    Pour recevoir la liste des serveurs : Sur quels serveurs es-tu connecté ?

    Pour recevoir la liste des membres connectés : Qui connais-tu ?

    Pour recevoir les messages envoyés au bot : Fais-moi suivre tes messages / Fais-moi suivre tous tes messages

    Pour envoyer un message à un autre membre via le bot : Envoie a "ID_OU_PSEUDO_DU_MEMBRE" le message "MESSAGE_A_ENVOYER"
