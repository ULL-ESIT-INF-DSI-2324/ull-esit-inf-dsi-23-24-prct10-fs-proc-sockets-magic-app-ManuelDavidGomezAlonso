import { jsonCards } from "./jsonController.js";
import { magicCard} from "./magiCard.js";
import net from "net";

const server = net.createServer((conection) => {
  conection.on("data", (data) => {
    console.log("Data received");
    const json = JSON.parse(data.toString());
    if (json.action === "add") {
      const card = new jsonCards();
      const magiCard = new magicCard(json.card.user, json.card.id, json.card.name, json.card.manaCost, json.card.color, json.card.typo, json.card.rare, json.card.rules, json.card.value, json.card.strRes, json.card.loyalty);
      card.add(magiCard);
      conection.end();
    } else if (json.action === "showAll") {
      const card = new jsonCards();
      const collection = card.showAllCards(json.user);
      if(collection.length !== 0) {
        collection.forEach((cards) => {
          const jsoncard = JSON.stringify(cards)
          conection.write(jsoncard);
        });
      } else {
        conection.write(`{"error": "Colección vacía."}`)
      }
      conection.end();
    } else if (json.action === "update") {
      const card = new jsonCards();
      const magiCard = new magicCard(json.card.user, json.card.id, json.card.name, json.card.manaCost, json.card.color, json.card.typo, json.card.rare, json.card.rules, json.card.value, json.card.strRes, json.card.loyalty);
      card.update(magiCard);
      conection.end();
    } else if (json.action === "delete") {
      const card = new jsonCards();
      card.delete(json.user as string, json.id as number);
      console.log("Card deleted on server side");
      conection.end();
    } else if (json.action === "show") {
      const card = new jsonCards();
      if (card.showCard(json.user, json.id)){
        const json2 = card.showCard(json.user, json.id);
        conection.write(JSON.stringify(json2));
      }
      conection.end();
    } else {
      console.log("Invalid action");
      conection.end();
    }
  });
  server.on('close', () => {
    conection.end();
  });
})

server.listen(60300, () => {
  console.log("Server listening on port 60300");
});