import { EntityComponentTypes, EquipmentSlot, system, world } from "@minecraft/server";
import { CustomForm, ObservableString } from "@minecraft/server-ui";

world.beforeEvents.itemUse.subscribe((e) => {
	const { itemStack } = e;
	if (itemStack?.matches("minecraft:name_tag")) {
		e.cancel = true;
		const player = e.source;
		system.run(() => {
			const textInput = new ObservableString(itemStack.nameTag ?? "", { clientWritable: true });
			const form = new CustomForm(player, { rawtext: [{ translate: "gui.edit" }, { text: " " }, { translate: itemStack.localizationKey }] })
				.textField("", textInput)
				.spacer()
				.button({ translate: "gui.submit" }, () => {
					const slot = player.getComponent(EntityComponentTypes.Equippable)?.getEquipmentSlot(EquipmentSlot.Mainhand);
					if (slot?.hasItem() && slot.typeId === itemStack.typeId) {
						itemStack.nameTag = textInput.getData();
						slot.setItem(itemStack);
					}
					form.close();
				});
			form.show();
		});
	}
})