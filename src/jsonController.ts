/**
 * @fileoverview jsonController.ts - Controla las acciones sobre los Json que representan las cartas de Magic.
 */

import * as fs from "fs";
import { magicCard } from "./magiCard.js";
import chalk from "chalk";

const directorioUsuario = `./src/usuarios/`;

/**
 * Clase jsonCards, implementa los métodos para añadir, eliminar, mostrar, modificar y mostrar todas las cartas de un usuario.
 */
export class jsonCards {
  /**
   * @brief Constructor de la clase jsonCards.
   * Se verifica si existe el directorio del usuario, si no existe se crea.
   */
  constructor() {
    if (!fs.existsSync("./src/usuarios")) {
      fs.mkdirSync("./src/usuarios");
    }
  }

  /**
   * @brief Añade una carta al directorio del usuario.
   * @param card Carta a añadir.
   */
  add(card: magicCard) {
    if (!fs.existsSync(`${directorioUsuario}/${card.user}`)) {
      fs.mkdirSync(`${directorioUsuario}/${card.user}`);
    }
    if (fs.existsSync(`${directorioUsuario}/${card.user}/${card.id_}.json`)) {
      console.log(chalk.red((`Card already exists in ${process.env.USER}`)));
    } else {
      fs.writeFileSync(
        `${directorioUsuario}/${card.user}/${card.id_}.json`,
        JSON.stringify(card),
      );
      console.log(chalk.green("Card added"));
    }
  }

  /**
   * @brief Elimina una carta del directorio del usuario.
   * @param cardID ID de la carta a eliminar.
   */
  delete(cardUser:string, cardID: number) {
    if (fs.existsSync(`${directorioUsuario}/${cardUser}/${cardID}.json`)) {
      fs.unlinkSync(`${directorioUsuario}/${cardUser}/${cardID}.json`);
      console.log(chalk.green("Card deleted"));
    } else {
      console.log(chalk.red((`Card not found in ${cardUser} collection`)));
    }
  }

  /**
   * @brief Muestra una carta del directorio del usuario.
   * @param showIDCard ID de la carta a mostrar.
   */
  showCard(cardUser:string, showIDCard: number) {
    const filePath = `${directorioUsuario}/${cardUser}/${showIDCard}.json`;
    if (fs.existsSync(filePath)) {
      console.log(chalk.green("Showing card"));
      const cardData = fs.readFileSync(filePath, "utf-8");
      const card = JSON.parse(cardData);
      console.log(chalk.blue(`ID: ${showIDCard}`));
      console.log(chalk.blue(`Name: ${card.name_}`));
      console.log(chalk.blue(`Mana Cost: ${card.manaCost_}`));
      console.log(chalk.blue(`Color: ${card.color_}`));
      console.log(chalk.blue(`Type: ${card.type_}`));
      console.log(chalk.blue(`Rare: ${card.rare_}`));
      console.log(chalk.blue(`Rules: ${card.rules_}`));
      console.log(chalk.blue(`Loyalty: ${card.loyalty_}`));
      console.log(chalk.blue(`Value: ${card.value_}`));
      if (card.strRes_) {
        console.log(chalk.blue(`Strength/Resistance: ${card.strRes_}`));
      }
      return card;
    } else {
      //creando un json con un campo error.
      const json = `"error": "Not  found card in ${cardUser} collection"`;
      return json;
    }
  }

  /**
   * @brief Actualiza una carta del directorio del usuario, lo que quiere decir que la carta debe existir.
   * @param card Carta a actualizar.
   */
  update(card: magicCard) {
    if (fs.existsSync(`${directorioUsuario}/${card.user}/${card.id_}.json`)) {
      fs.writeFileSync(
        `${directorioUsuario}/${card.user}/${card.id_}.json`,
        JSON.stringify(card),
      );
      console.log(chalk.green("Card updated"));
    } else {
      console.log(chalk.red((`Card not found in ${card.user} collection.`)));
    }
  }

  /**
   * @brief Muestra todas las cartas del directorio del usuario.
   * Se leen todos los archivos del directorio del usuario y se muestran.
   */
  showAllCards(cardsUser:string) {
    const cards = fs.readdirSync(`${directorioUsuario}/${cardsUser}`);
    const cardsArray: magicCard[] = [];
    cards.forEach((card) => {
      cardsArray.push(
        JSON.parse(fs.readFileSync(`${directorioUsuario}/${cardsUser}/${card}`, "utf-8")),
      );
    });
    console.log(chalk.green("Showing cards"));
    cardsArray.forEach((card) => {
      console.log(
        chalk.blue(
          "-----------------------------------------------------------------------------------------------------------------",
        ),
      );
      console.log(chalk.blue(`ID: ${card.id_}`));
      console.log(chalk.blue(`Name: ${card.name_}`));
      console.log(chalk.blue(`Mana Cost: ${card.manaCost_}`));
      console.log(chalk.blue(`Color: ${card.color_}`));
      console.log(chalk.blue(`Type: ${card.typo_}`));
      console.log(chalk.blue(`Rare: ${card.rare_}`));
      console.log(chalk.blue(`Rules: ${card.rules_}`));
      console.log(chalk.blue(`Loyalty: ${card.loyalty_}`));
      console.log(chalk.blue(`Value: ${card.value_}`));
      if (card.strRes_) {
        console.log(chalk.blue(`Strength/Resistance: ${card.strRes_}`));
      }
    });
    return cardsArray;
  }
}