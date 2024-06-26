/**
 * @fileoverview Este archivo contiene la declaración de los comandos, y el uso de las funciones para gestionar las cartas mediante ficheros JSON.
 * Manuel David Gomez Alonso.
 * DSI - PR10
 */
import { hideBin } from "yargs/helpers";
import { magicCard, color, tipe, rare } from "./magiCard.js";
import chalk from "chalk";
import yargs, { Options } from "yargs";
import net from "net";

const client = net.connect({ port: 60300 });

/**
 * @brief Argumentos comunes para los comandos.
 */
const commonArgs: { [key: string]: Options } = {
  user: {
    description: "User",
    type: "string",
    demandOption: true,
  },
  id: {
    description: "Card ID",
    type: "number",
    demandOption: true,
  },
  name: {
    description: "card name",
    type: "string",
    demandOption: true,
  },
  manaCost: {
    description: "Mana cost",
    type: "number",
    demandOption: true,
  },
  color: {
    description: "Color",
    choices: Object.values(color),
    demandOption: true,
  },
  type: {
    description: "Type",
    choices: Object.values(tipe),
    demandOption: true,
  },
  rare: {
    description: "Rare",
    choices: Object.values(rare),
    demandOption: true,
  },
  rules: {
    description: "Rules",
    type: "string",
    demandOption: true,
  },
  loyalty: {
    description: "Loyalty",
    type: "number",
  },
  value: {
    description: "Value",
    type: "number",
    demandOption: true,
  },
  strRes: {
    description: "Strength/Resistance",
    type: "number",
  },
};

/**
 * @brief Comprueba que los argumentos de la carta sean correctos.
 * @param argv Argumentos de la carta.
 */
function comprube(argv: magicCard) {
  if (typeof argv.user !== "string") {
    throw chalk.red(new Error("User must be a string"));
  }
  if (isNaN(argv.id_)) {
    throw chalk.red(new Error("ID must be a number"));
  }

  if (typeof argv.name_ !== "string") {
    throw chalk.red(new Error("Name must be a string"));
  }

  if (isNaN(argv.manaCost_)) {
    throw chalk.red(new Error("Mana Cost must be a number"));
  }

  if (!Object.values(color).includes(argv.color_)) {
    throw chalk.red(new Error("Color must be a valid color"));
  }

  if (!Object.values(tipe).includes(argv.typo_)) {
    throw chalk.red(new Error("Type must be a valid type"));
  }

  if (!Object.values(rare).includes(argv.rare_)) {
    throw chalk.red(new Error("Rare must be a valid rare"));
  }

  if (typeof argv.rules_ !== "string") {
    throw chalk.red(new Error("Rules must be a string"));
  }

  if (argv.typo_ === Object.values(tipe)[5]) {
    if (!argv.loyalty_) {
      throw chalk.red(new Error("planeswalker type must have Loyalty"));
    }
  } else {
    if (argv.loyalty_ !== undefined) {
      throw chalk.red(new Error("Loyalty is only for planeswalker type"));
    }
  }

  if (isNaN(argv.value_)) {
    throw chalk.red(new Error("Value must be a number"));
  }

  if (argv.strRes_ && isNaN(argv.strRes_)) {
    throw chalk.red(new Error("Strength/Resistance must be a number"));
  }

  if (argv.typo_ === Object.values(tipe)[0]) {
    if (!argv.strRes_) {
      throw chalk.red(new Error("Creature type must have Strength/Resistance"));
    }
  } else {
    if (argv.strRes_ !== undefined) {
      throw chalk.red(
        new Error("Strength/Resistance is only for Creature type"),
      );
    }
  }
}

/**
 * @brief Comando para añadir una carta a la colección, utiliza la función add de la clase jsonCards.
 * Para ello se le pasan todos los argumentos necesarios para crear una carta que posteriormente serán comprobados y se lanzarán errores si no son correctos.
 * @param id ID de la carta
 * @param name Nombre de la carta
 * @param manaCost Coste de maná
 * @param color Color de la carta
 * @param type Tipo de la carta
 * @param rare Rareza de la carta
 * @param rules Reglas de la carta
 * @param loyalty Lealtad de la carta
 * @param value Valor de la carta
 * @param strRes Fuerza/Resistencia de la carta, debe ser del tipo creature.
 * Todos los parametros se añadiran por comandos mediante --.
 * __Ejemplo de uso:__ node dist/app.js add --id 1 --name "Carta1" --manaCost 1 --color white --type creature --rare common --rules "Reglas" --loyalty 1 --value 1 --strRes 1.
 */
// eslint-disable-next-line
const argv = yargs(hideBin(process.argv))
  .command(
    "add",
    "Adds a card to the collection",
    {
      ...commonArgs,
    },
    (argv) => {
      const card = new magicCard(
        argv.user as string,
        argv.id as number,
        argv.name as string,
        argv.manaCost as number,
        argv.color as color,
        argv.type as tipe,
        argv.rare as rare,
        argv.rules as string,
        argv.value as number,
        argv.strRes as number | undefined,
        argv.loyalty as number | undefined,
      );
      comprube(card);
      const json = `{
        "action": "add",
        "card": {
        "user": "${argv.user}",
        "id": "${argv.id}",
        "name": "${argv.name}",
        "manaCost": "${argv.manaCost}",
        "color": "${argv.color}",
        "type": "${argv.type}",
        "rare": "${argv.rare}",
        "rules": "${argv.rules}",
        "value": "${argv.value}",
        "strRes": "${argv.strRes}",
        "loyalty": "${argv.loyalty}"
      }
      }`;
      client.write(json);
    },
  )

  /**
   * @brief Comando para borrar una carta de la colección, utiliza la función delete de la clase jsonCards.
   * @param id ID de la carta a borrar.
   * __Ejemplo de uso:__ node dist/app.js delete --id 1
   */
  .command(
    "delete",
    "Deleting a card from collection",
    {
      user: {
        description: "User",
        type: "string",
        demandOption: true,
      },
      id: {
        description: "Card ID",
        type: "number",
        demandOption: true,
      },
    },
    (argv) => {
      if (isNaN(argv.id)) {
        throw chalk.red(new Error("ID must be a number"));
      }
      const json = `{
        "action": "delete",
        "user": "${argv.user}",
        "id": "${argv.id}"
      }`;
      client.write(json);
    },
  )

  /**
   * @brief Comando para mostrar una carta de la colección, utiliza la función showCard de la clase jsonCards.
   * @param id ID de la carta a mostrar.
   * __Ejemplo de uso:__ node dist/app.js show --id 1
   */
  .command(
    "show",
    "Show a card from collection",
    {
      user: {
        description: "User",
        type: "string",
        demandOption: true,
      },
      id: {
        description: "Card ID",
        type: "number",
        demandOption: true,
      },
    },
    (argv) => {
      if (isNaN(argv.id)) {
        throw chalk.red(new Error("ID must be a number"));
      }
      const json = `{
        "action": "show",
        "user": "${argv.user}",
        "id": "${argv.id}"
      }`;
      client.write(json);
    },
  )

  /**
   * @brief Comando para actualizar una carta de la colección, utiliza la función update de la clase jsonCards, muy parecida a add, conla diferencia de que la carta debe existir.
   * __Ejemplo de uso:__ node dist/app.js update --id 1 --name "Carta1" --manaCost 1 --color white --type creature --rare common --rules "Reglas" --loyalty 1 --value 1 --strRes 1
   */
  .command(
    "update",
    "Update a card from collection",
    {
      ...commonArgs,
    },
    (argv) => {
      const card = new magicCard(
        argv.user as string,
        argv.id as number,
        argv.name as string,
        argv.manaCost as number,
        argv.color as color,
        argv.type as tipe,
        argv.rare as rare,
        argv.rules as string,
        argv.value as number,
        argv.strRes as number | undefined,
        argv.loyalty as number | undefined,
      );
      comprube(card);
      const json2 = `{
        "action": "update",
        "card": {
        "user": "${argv.user}",
        "id": "${argv.id}",
        "name": "${argv.name}",
        "manaCost": "${argv.manaCost}",
        "color": "${argv.color}",
        "type": "${argv.type}",
        "rare": "${argv.rare}",
        "rules": "${argv.rules}",
        "value": "${argv.value}",
        "strRes": "${argv.strRes}",
        "loyalty": "${argv.loyalty}"
      }
      }`;
      client.write(json2);
    },
  )

  /**
   * @brief Comando para mostrar todas las cartas de la colección, utiliza la función showAllCards de la clase jsonCards.
   * __Ejemplo de uso:__ node dist/app.js showAll
   */
  .command(
    "showAll",
    "Show all cards from collection",
    {
      user: {
        description: "User",
        type: "string",
        demandOption: true,
      },
    },
    (argv) => {
      const json = `{
      "action": "showAll",
      "user": "${argv.user}"
    }`;
      client.write(json);
    },
  )

  .help().argv;

client.on("data", (data) => {
  const parsingData = JSON.parse(data.toString());
  if (!parsingData.error!) {
    console.log(
      "-----------------------------------------------------------------------------------------------------",
    );
    console.log(chalk.blue(`ID: ${parsingData.id_}`));
    console.log(chalk.blue(`Name: ${parsingData.name_}`));
    console.log(chalk.blue(`Mana Cost: ${parsingData.manaCost_}`));
    console.log(chalk.blue(`Color: ${parsingData.color_}`));
    console.log(chalk.blue(`Type: ${parsingData.typo_}`));
    console.log(chalk.blue(`Rare: ${parsingData.rare_}`));
    console.log(chalk.blue(`Rules: ${parsingData.rules_}`));
    console.log(chalk.blue(`Loyalty: ${parsingData.loyalty_}`));
    console.log(chalk.blue(`Value: ${parsingData.value_}`));
    if (parsingData.strRes_) {
      console.log(chalk.blue(`Strength/Resistance: ${parsingData.strRes_}`));
    }
  } else {
    console.log(`Ha sucedido un error: ${parsingData.error}`);
  }
});
