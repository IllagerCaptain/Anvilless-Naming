import { EntityComponentTypes, EquipmentSlot, GameMode, world } from "@minecraft/server";
import { ModalFormData } from "@minecraft/server-ui";

world.afterEvents.itemUse.subscribe((e) => {
	if (e.itemStack.matches("minecraft:name_tag")) {
		const form = new ModalFormData();
		form.title("%gui.edit %item.name_tag.name");
		form.textField("", e.itemStack.nameTag ? {
			rawtext: [
				{
					text: `§o${e.itemStack.nameTag}`
				}
			]
		} : {
			rawtext: [
				{
					translate: e.itemStack.localizationKey
				}
			]
		});
		form.submitButton({
			rawtext: [
				{
					translate: "gui.done"
				}
			]
		});
		form.show(e.source).then((response) => {
			if (!response.canceled && response.formValues[0]) {
				const slot = e.source.getComponent(EntityComponentTypes.Equippable).getEquipmentSlot(EquipmentSlot.Mainhand);
				if (slot.hasItem() && slot.typeId === e.itemStack.typeId) {
					e.itemStack.nameTag = response.formValues[0];
					slot.setItem(e.itemStack);
				}
			}
		});
	}
});