/**
 * @fileoverview jsonController.ts - Controla las acciones sobre los Json que representan las cartas de Magic.
 */

import * as fs from "fs";
import { magicCard } from "./magiCard.js";
import chalk from "chalk";

const directorioUsuario = `./src/usuarios/${process.env.USER}`;

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
    if (!fs.existsSync(directorioUsuario)) {
      fs.mkdirSync(directorioUsuario);
    }
  }

  /**
   * @brief Añade una carta al directorio del usuario.
   * @param card Carta a añadir.
   */
  add(card: magicCard) {
    if (fs.existsSync(`${directorioUsuario}/${card.id_}.json`)) {
      console.log(chalk.red((`Card already exists in ${process.env.USER}`)));
    } else {
      fs.writeFileSync(
        `${directorioUsuario}/${card.id_}.json`,
        JSON.stringify(card),
      );
      console.log(chalk.green("Card added"));
    }
  }

  /**
   * @brief Elimina una carta del directorio del usuario.
   * @param cardID ID de la carta a eliminar.
   */
  delete(cardID: number) {
    if (fs.existsSync(`${directorioUsuario}/${cardID}.json`)) {
      fs.unlinkSync(`${directorioUsuario}/${cardID}.json`);
      console.log(chalk.green("Card deleted"));
    } else {
      console.log(chalk.red((`Card not found in ${process.env.USER}`)));
    }
  }

  /**
   * @brief Muestra una carta del directorio del usuario.
   * @param showIDCard ID de la carta a mostrar.
   */
  showCard(showIDCard: number) {
    const filePath = `${directorioUsuario}/${showIDCard}.json`;
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
    } else {
      console.log(chalk.red((`Card not found in ${process.env.USER}`)));
    }
  }

  /**
   * @brief Actualiza una carta del directorio del usuario, lo que quiere decir que la carta debe existir.
   * @param card Carta a actualizar.
   */
  update(card: magicCard) {
    if (fs.existsSync(`${directorioUsuario}/${card.id_}.json`)) {
      fs.writeFileSync(
        `${directorioUsuario}/${card.id_}.json`,
        JSON.stringify(card),
      );
      console.log(chalk.green("Card updated"));
    } else {
      console.log(chalk.red((`Card not found in ${process.env.USER}`)));
    }
  }

  /**
   * @breif Modifica una propiedad de una carta existente.
   * @param cardID Id de la carta a modificar.
   * @param valueToChange Campo a modificar.
   * @param newValue Nuevo valor del campo.
   * Se verifica que la carta exista y que el campo a modificar exista en la carta.
   */
  modify(cardID: number, valueToChange: string, newValue: string | number) {
    if (fs.existsSync(`${directorioUsuario}/${cardID}.json`)) {
      const card = fs.readFileSync(
        `${directorioUsuario}/${cardID}.json`,
        "utf-8",
      );
      const cardObj = JSON.parse(card);
      if (cardObj[valueToChange] !== undefined) {
        cardObj[valueToChange] = newValue;
        fs.writeFileSync(
          `${directorioUsuario}/${cardID}.json`,
          JSON.stringify(cardObj),
        );
        console.log(chalk.green("Card modified"));
      } else {
        console.log(chalk.red(("Property not found in object magicCard")));
      }
    } else {
      console.log(chalk.red(`Card not found in ${process.env.USER}`));
    }
  }

  /**
   * @brief Muestra todas las cartas del directorio del usuario.
   * Se leen todos los archivos del directorio del usuario y se muestran.
   */
  showAllCards() {
    const cards = fs.readdirSync(directorioUsuario);
    const cardsArray: magicCard[] = [];
    cards.forEach((card) => {
      cardsArray.push(
        JSON.parse(fs.readFileSync(`${directorioUsuario}/${card}`, "utf-8")),
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
  }
}