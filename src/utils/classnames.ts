import classNames from "classnames";

type NameWithModifiers<Name extends string> = [
  name: Name,
  modifiers: Record<string, unknown>
];

export class BemClassNamesCreator {
  constructor(private prefix?: string) {
    this.prefix = prefix;
  }

  private getNameWithModifiers<Name extends string>(
    nameElement: Name | NameWithModifiers<Name>
  ): NameWithModifiers<Name> {
    const name = typeof nameElement === "string" ? nameElement : nameElement[0];
    const modifiers = typeof nameElement === "string" ? {} : nameElement[1];

    return [name, modifiers];
  }

  private createBemRecord<Name extends string>(
    [blockName, blockModifiers]: NameWithModifiers<Name>,
    blockNames: string[],
    elementsNames: Array<NameWithModifiers<Name>>
  ) {
    const returnObject = {
      [blockName]: blockNames
        .map((name) =>
          classNames(
            name,
            Object.fromEntries(
              Object.entries(blockModifiers).map(([key, value]) => [
                `${name}--${key}`,
                value,
              ])
            )
          )
        )
        .join(" "),
    };

    elementsNames.forEach((element) => {
      const [elementName, elementModifiers] = element;

      returnObject[elementName] = blockNames
        .map((name) =>
          classNames(
            `${name}__${elementName}`,
            Object.fromEntries(
              Object.entries(elementModifiers).map(([key, value]) => [
                `${name}__${elementName}--${key}`,
                value,
              ])
            )
          )
        )
        .join(" ");
    });

    return returnObject as Record<Name, string>;
  }

  static create<Name extends string>(
    block: Name | NameWithModifiers<Name>,
    className: string | undefined,
    ...elements: Array<Name | NameWithModifiers<Name>>
  ): Record<Name, string> {
    const creator = new BemClassNamesCreator();

    const blockNameWithModifiers = creator.getNameWithModifiers(block);

    const blockNames = [
      blockNameWithModifiers[0],
      ...(className?.trim().split(/\s+/) ?? []),
    ];

    const elementsNames = elements.map(creator.getNameWithModifiers);

    return creator.createBemRecord(
      blockNameWithModifiers,
      blockNames,
      elementsNames
    );
  }

  public create<Name extends string>(
    block: Name | NameWithModifiers<Name>,
    className: string | undefined,
    ...elements: Array<Name | NameWithModifiers<Name>>
  ): Record<Name, string> {
    const blockNameWithModifiers = this.getNameWithModifiers(block);

    const [blockName] = blockNameWithModifiers;

    const blockNames = [
      this.prefix ? `${this.prefix}-${blockName}` : blockName,
      ...(className?.trim().split(/\s+/) ?? []),
    ];

    const elementsNames = elements.map(this.getNameWithModifiers);

    return this.createBemRecord(
      blockNameWithModifiers,
      blockNames,
      elementsNames
    );
  }
}
