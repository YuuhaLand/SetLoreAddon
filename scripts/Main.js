import { system } from "@minecraft/server";

system.afterEvents.scriptEventReceive.subscribe(data => {
  if (data.sourceType !== "Entity") return;
  if (data.sourceEntity.typeId !== "minecraft:player") return;
  const player = data.sourceEntity;
  
  if (data.id === "sla:setlore") {
    const inventory = player.getComponent("inventory").container;
    const selectedItem = inventory.getItem(player.selectedSlotIndex);
    if (!selectedItem) {
      player.sendMessage("§cアイテムを持っていません!");
      return;
    }
    if (!data.message) {
      player.sendMessage("§c使い方: /scriptevent sla:setlore テキスト");
      return;
    }
    const loreList = data.message.split("\\n");
    if (loreList.length > 20) {
      player.sendMessage("§c改行しすぎです! 20行以内に収めてください。");
      return;
    }
    for (const lore of loreList) {
      if (lore.length > 50) {
        player.sendMessage("§c長すぎる行があります! 各行は50字以内に収めてください。");
        return;
      }
    }
    
    try {
      selectedItem.setLore(loreList);
      inventory.setItem(player.selectedSlotIndex, selectedItem);
      player.sendMessage("§aLoreを設定しました!");
    } catch(e) {
      player.sendMessage(`§cエラーが発生したので設定ができませんでした!\n${e}`);
    }
    return;
  }
  
  if (data.id === "sla:clearlore") {
    const inventory = player.getComponent("inventory").container;
    const selectedItem = inventory.getItem(player.selectedSlotIndex);
    if (!selectedItem) {
      player.sendMessage("§cアイテムを持っていません!");
      return;
    }

    try {
      selectedItem.setLore();
      inventory.setItem(player.selectedSlotIndex, selectedItem);
      player.sendMessage("§aLoreをクリアしました!");
    } catch(e) {
      player.sendMessage(`§cエラーが発生したのでができませんでした!\n${e}`);
    }
    return;
  }
}, {namespaces: ["sla"]})