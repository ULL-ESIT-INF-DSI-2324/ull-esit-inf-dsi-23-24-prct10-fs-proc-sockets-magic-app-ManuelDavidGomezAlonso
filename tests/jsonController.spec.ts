
import 'mocha';
import { expect } from 'chai';
import { jsonCards } from '../src/jsonController.js';
import { magicCard, color, tipe, rare} from '../src/magiCard.js';
import fs from 'fs';
import chalk from 'chalk';

const directorioUsuario = `./src/usuarios/${process.env.USER}`;

describe('JsonController', () => {

  it('should create an instance', () => {
    expect(new jsonCards()).to.be.an.instanceOf(jsonCards);
  });

  it('should create a directory usuarios', () => {
    if (fs.existsSync('./src/usuarios')) {
      fs.rmdirSync('./src/usuarios', { recursive: true });  
    }
    new jsonCards();
    expect(fs.existsSync('./src/usuarios')).to.be.equal(true);
  });
  
  it('should create a directory', () => {
    if (fs.existsSync(directorioUsuario)) {
      fs.rmdirSync(directorioUsuario, { recursive: true });  
    }
    new jsonCards();
    expect(fs.existsSync(directorioUsuario)).to.be.equal(true);
  });

  it('should add a card to the list', () => {
    const files = fs.readdirSync(directorioUsuario);
    const preadd = files.length;
    const controller = new jsonCards();
    const cart = new magicCard(0,'Cazador', 16, color.multicolor, tipe.creature, rare.mythicRare, 'No puede atacar cuerpo a cuerpo', 150, 100, 1000);    
    if (fs.existsSync(`${directorioUsuario}/0.json`)){
      expect(fs.existsSync(`${directorioUsuario}/0.json`)).to.be.equal(true);
    } else {
    controller.add(cart);
    const postadd = fs.readdirSync(directorioUsuario).length;
    expect(postadd).to.be.equal(preadd + 1);
    }
  });

  it('should not add a card already exist', () => {
    const preadd = fs.readdirSync(directorioUsuario).length;
    const controller = new jsonCards();
    const cart = new magicCard(0,'Cazador', 16, color.multicolor, tipe.creature, rare.mythicRare, 'No puede atacar cuerpo a cuerpo', 150, 100, 1000);
    controller.add(cart);
    const postadd = fs.readdirSync(directorioUsuario).length;
    expect(postadd).to.be.equal(preadd);
  });

  it('should update a card', () => {
    const preadd = fs.readdirSync(directorioUsuario).length;
    const controller = new jsonCards();
    const newCart = new magicCard(10000,'Jose', 16, color.multicolor, tipe.creature, rare.mythicRare, 'No puede atacar cuerpo a cuerpo', 150, 100, 1000);
    controller.update(newCart);
    const postadd = fs.readdirSync(directorioUsuario).length;
    expect(postadd).to.be.equal(preadd);
  });

  it('should update a card', () => {
    const controller = new jsonCards();
    const newCart = new magicCard(0,'Jose', 16, color.multicolor, tipe.creature, rare.mythicRare, 'No puede atacar cuerpo a cuerpo', 150, 100, 1000);
    if (!fs.existsSync(`${directorioUsuario}/0.json`)){
      controller.add(newCart);
    }
    controller.update(newCart);
    const cardData = fs.readFileSync(`${directorioUsuario}/0.json`, 'utf-8');
    const card = JSON.parse(cardData);
    expect(card.name_).to.be.equal(newCart.name_);
  });

  it('should show all cards', () => {
    const controller = new jsonCards();
    const cart = new magicCard(0,'Cazador', 16, color.multicolor, tipe.creature, rare.mythicRare, 'No puede atacar cuerpo a cuerpo', 150, 100, 1000);
    const cart2 = new magicCard(2,'Cazador', 16, color.multicolor, tipe.creature, rare.mythicRare, 'No puede atacar cuerpo a cuerpo', 150, 100, 1000);
    if (
      !fs.existsSync(`${directorioUsuario}/0.json`)){
    controller.add(cart);
      }
    if ( !fs.existsSync(`${directorioUsuario}/2.json`)){
    controller.add(cart2);
    }
    controller.showAllCards();
    const files = fs.readdirSync(directorioUsuario);
    expect(files.length).to.be.equal(2);
  });

  it('should delete a card', () => {
    const controller = new jsonCards();
    expect(() => controller.delete(1000)).to.throw(chalk.red(new Error(`Card not found in ${process.env.USER}`)));
  });

  it('should delete a card', () => {
    const controller = new jsonCards();
    const cart = new magicCard(0,'Cazador', 16, color.multicolor, tipe.creature, rare.mythicRare, 'No puede atacar cuerpo a cuerpo', 150, 100, 1000);
    const cart2 = new magicCard(2,'Cazador', 16, color.multicolor, tipe.creature, rare.mythicRare, 'No puede atacar cuerpo a cuerpo', 150, 100, 1000);
    if (!fs.existsSync(`${directorioUsuario}/0.json`)){
      controller.add(cart);
    }
    if ( !fs.existsSync(`${directorioUsuario}/2.json`)){
      controller.add(cart2);
    }
    controller.delete(0);
    let files
    if (fs.existsSync(`${directorioUsuario}/0.json`)){
      files = fs.readdirSync(`${directorioUsuario}/0.json`);
    } else {
      files = undefined;
    }
    expect(files).to.be.equal(undefined);
  });

  it('should delete a card', () => {
    const controller = new jsonCards();
    const cart = new magicCard(0,'Cazador', 16, color.multicolor, tipe.creature, rare.mythicRare, 'No puede atacar cuerpo a cuerpo', 150, 100, 1000);
    if (!fs.existsSync(`${directorioUsuario}/0.json`)){
      controller.add(cart);
    }
    if (fs.existsSync(`${directorioUsuario}/0.json`)){
      controller.delete(0);
    }
    let files
    if (fs.existsSync(`${directorioUsuario}/0.json`)){
      files = fs.readdirSync(`${directorioUsuario}/0.json`);
    } else {
      files = undefined;
    }
    expect(files).to.be.equal(undefined);
  });

  it('should modify a card', () => {
    const controller = new jsonCards();
    const cart = new magicCard(0,'Cazador', 16, color.multicolor, tipe.creature, rare.mythicRare, 'No puede atacar cuerpo a cuerpo', 150, 100, 1000);
    controller.add(cart);
    controller.modify(0, 'name_', 'Jose');
    const cardData = fs.readFileSync(`${directorioUsuario}/0.json`, 'utf-8');
    const card = JSON.parse(cardData);
    expect(card.name_).to.be.equal('Jose');
  });

  it('should modify a card', () => {
    const controller = new jsonCards();
    const cart = new magicCard(0,'Cazador', 16, color.multicolor, tipe.creature, rare.mythicRare, 'No puede atacar cuerpo a cuerpo', 150, 100, 1000);
    if(!fs.existsSync(`${directorioUsuario}/0.json`)){
      controller.add(cart);
    }
    controller.modify(0, 'name_', 'Jose');
    const cardData = fs.readFileSync(`${directorioUsuario}/0.json`, 'utf-8');
    const card = JSON.parse(cardData);
    expect(card.name_).to.be.equal('Jose');
  });

  it('should modify a card', () => {
    const controller = new jsonCards();
    const cart = new magicCard(0,'Cazador', 16, color.multicolor, tipe.creature, rare.mythicRare, 'No puede atacar cuerpo a cuerpo', 150, 100, 1000);
    if(!fs.existsSync(`${directorioUsuario}/0.json`)){
      controller.add(cart);
    }
    controller.modify(0, 'manaCost_', 20);
    const cardData = fs.readFileSync(`${directorioUsuario}/0.json`, 'utf-8');
    const card = JSON.parse(cardData);
    expect(card.manaCost_).to.be.equal(20);
  });

  it('should modify a card', () => {
    const controller = new jsonCards();
    const cart = new magicCard(0,'Cazador', 16, color.multicolor, tipe.creature, rare.mythicRare, 'No puede atacar cuerpo a cuerpo', 150, 100, 1000);
    if(!fs.existsSync(`${directorioUsuario}/0.json`)){
      controller.add(cart);
    }
    controller.modify(0, 'color_', color.white);
    const cardData = fs.readFileSync(`${directorioUsuario}/0.json`, 'utf-8');
    const card = JSON.parse(cardData);
    expect(card.color_).to.be.equal(color.white);
  });

  it('should modify a card', () => {
    const controller = new jsonCards();
    const cart = new magicCard(0,'Cazador', 16, color.multicolor, tipe.creature, rare.mythicRare, 'No puede atacar cuerpo a cuerpo', 150, 100, 1000);
    if (!fs.existsSync(`${directorioUsuario}/0.json`)){
      controller.add(cart);
    }
    controller.modify(0, 'typo_', tipe.instant);
    const cardData = fs.readFileSync(`${directorioUsuario}/0.json`, 'utf-8');
    const card = JSON.parse(cardData);
    expect(card.typo_).to.be.equal(tipe.instant);
  });

  it('should modify a card', () => {
    const controller = new jsonCards();
    const cart = new magicCard(0,'Cazador', 16, color.multicolor, tipe.creature, rare.mythicRare, 'No puede atacar cuerpo a cuerpo', 150, 100, 1000);
    if (!fs.existsSync(`${directorioUsuario}/0.json`)){
      controller.add(cart);
    }
    controller.modify(0, 'rare_', rare.common);
    const cardData = fs.readFileSync(`${directorioUsuario}/0.json`, 'utf-8');
    const card = JSON.parse(cardData);
    expect(card.rare_).to.be.equal(rare.common);
  });

  it('should show a card', () => {
    const controller = new jsonCards();
    expect(() => controller.showCard(1000)).to.throw(chalk.red(new Error(`Card not found in ${process.env.USER}`)));
  });

  it('should show a card', () => {
    const controller = new jsonCards();
    const cart = new magicCard(0,'Cazador', 16, color.multicolor, tipe.creature, rare.mythicRare, 'No puede atacar cuerpo a cuerpo', 150, 100, 1000);
    if (!fs.existsSync(`${directorioUsuario}/0.json`)){
      controller.add(cart);
    } else {
      controller.modify(0, 'name_', 'Cazador');
    }
    controller.showCard(0);
    const cardData = fs.readFileSync(`${directorioUsuario}/0.json`, 'utf-8');
    const card = JSON.parse(cardData);
    expect(card.name_).to.be.equal('Cazador');
  });

  it('should modify a card', () => {
    const controller = new jsonCards();
    expect(() => controller.modify(1000, 'name_', 'Jose')).to.throw(chalk.red(new Error(`Card not found in ${process.env.USER}`)));
  });

  it('should modify a card', () => {
    const controller = new jsonCards();
    const cart = new magicCard(0,'Cazador', 16, color.multicolor, tipe.creature, rare.mythicRare, 'No puede atacar cuerpo a cuerpo', 150, 100, 1000);
    if (!fs.existsSync(`${directorioUsuario}/0.json`)){
      controller.add(cart);
    }
    expect(() => controller.modify(0, 'name', 1000)).to.throw(chalk.red(new Error("Property not found in object magicCard")));
  });
});