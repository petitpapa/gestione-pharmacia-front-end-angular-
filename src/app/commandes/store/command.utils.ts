import {
  CommandContainer,
  CommandItem,
} from "../../core/models/command.response";
import * as _ from "lodash-es";
export class CommandUtils {
  static updateItem(command: CommandContainer, toUpdate: CommandItem): CommandContainer {
    const cmd: CommandContainer = _.cloneDeep(command);
    const foundedItem = _.findIndex(
      cmd.items,
      (item) => item.productId === toUpdate.productId
    );
    if (foundedItem > -1) {
      cmd.items.splice(foundedItem, 1);
      cmd.items.push(toUpdate);
    }
    return cmd;
  }

  static updateInvoice(command: CommandContainer, properties): CommandContainer{
    const cmd: CommandContainer = _.cloneDeep(command);
    cmd.deliveryDate = properties.deliveryDate;
    cmd.invoiceNumber = properties.invoiceNumber;
    cmd.totalAmount = properties.totalAmount;
    cmd.totalDiscount = properties.totalDiscount;
    return cmd;
  }

  static addItem(
    command: CommandContainer,
    item: CommandItem
  ): CommandContainer {
    const cmd: CommandContainer = _.cloneDeep(command);

    const foundedItem = _.find(
      cmd.items,
      (i) => i.productId === item.productId
    );
    if (foundedItem) {
      if (foundedItem.productId.includes("@")) {
        const itemFounded: CommandItem[] = CommandUtils.foundDuplicates(
          cmd,
          foundedItem
        );

        CommandUtils.sortItems(itemFounded);
        const lastItem = CommandUtils.gestLastItem(itemFounded);
        const indexAndDuplicate: string[] = CommandUtils.splitItemIdx(lastItem);
        const itemCloned = _.cloneDeep(lastItem);
        buidIdOfNewItem(itemCloned, indexAndDuplicate);
        cmd.items.push(itemCloned);
      } else {
        const itemFounded: CommandItem[] = CommandUtils.foundDuplicates(
          cmd,
          item
        );
        if (itemFounded && itemFounded.length > 0) {
          const itemFounded: CommandItem[] = _.filter(
            cmd.items,
            (p: CommandItem) => p.productId.startsWith(item.productId + "@")
          );

          CommandUtils.sortItems(itemFounded);
          const lastItem = CommandUtils.gestLastItem(itemFounded);
          const indexAndDuplicate: string[] = lastItem.productId.split("@");
          const itemCloned = _.cloneDeep(lastItem);
          buidIdOfNewItem(itemCloned, indexAndDuplicate);
          cmd.items.push(itemCloned);
        } else {
          const itemCloned = _.cloneDeep(item);
          itemCloned.productId = item.productId.concat("@").concat("1");
          cmd.items.push(itemCloned);
        }
      }
    }

    return Object.assign({}, cmd);
  }

  private static splitItemIdx(lastItem: CommandItem): string[] {
    return lastItem.productId.split("@");
  }

  private static gestLastItem(itemFounded: CommandItem[]) {
    return itemFounded[itemFounded.length - 1];
  }

  private static sortItems(itemFounded: CommandItem[]) {
    itemFounded.sort((a, b) =>
      +a.productId.split("@")[1] > +b.productId.split("@")[1] ? 1 : -1
    );
  }

  private static foundDuplicates(
    cmd: CommandContainer,
    foundedItem: any
  ): CommandItem[] {
    return _.filter(cmd.items, (p: CommandItem) =>
      p.productId.startsWith(foundedItem.productId.split("@")[0].concat("@"))
    );
  }
}
function buidIdOfNewItem(itemCloned: any, indexAndDuplicate: string[]) {
  itemCloned.productId = indexAndDuplicate[0]
    .concat("@")
    .concat(_.toString(parseInt(indexAndDuplicate[1]) + Number(1)));
}
