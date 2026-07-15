const fields = foundry.data.fields;

class DHBaseActorModel extends foundry.abstract.TypeDataModel {
    static defineSchema() {
        return {
            wounds: new fields.ObjectField({}),
            initiative: new fields.ObjectField({}),
            size: new fields.NumberField({ integer: true, initial: 4 }),
            characteristics: new fields.ObjectField({}),
            movement: new fields.ObjectField({}),
        };
    }
}

export class DHAcolyteModel extends DHBaseActorModel {
    static htmlFields = ["bio.notes"];

    static defineSchema() {
        const schema = super.defineSchema();
        schema.fatigue = new fields.ObjectField({});
        schema.fate = new fields.ObjectField({});
        schema.psy = new fields.ObjectField({});
        schema.backpack = new fields.ObjectField({});
        schema.skills = new fields.ObjectField({});
        schema.bio = new fields.ObjectField({});
        schema.experience = new fields.ObjectField({});
        schema.insanity = new fields.NumberField({ initial: 0 });
        schema.corruption = new fields.NumberField({ initial: 0 });
        schema.aptitudes = new fields.ObjectField({});
        schema.backgroundEffects = new fields.ObjectField({});
        schema.armour = new fields.ObjectField({});
        schema.encumbrance = new fields.ObjectField({});
        return schema;
    }
}

export class DHNpcModel extends DHAcolyteModel {
    static defineSchema() {
        const schema = super.defineSchema();
        schema.faction = new fields.StringField({ initial: "" });
        schema.subfaction = new fields.StringField({ initial: "" });
        schema.type = new fields.StringField({ initial: "troop" });
        schema.threatLevel = new fields.NumberField({ integer: true, initial: 0 });
        return schema;
    }
}

export class DHVehicleModel extends DHBaseActorModel {
    static defineSchema() {
        const schema = super.defineSchema();
        schema.faction = new fields.StringField({ initial: "" });
        schema.subfaction = new fields.StringField({ initial: "" });
        schema.type = new fields.StringField({ initial: "troop" });
        schema.threatLevel = new fields.NumberField({ integer: true, initial: 0 });
        schema.front = new fields.StringField({ initial: "" });
        schema.side = new fields.StringField({ initial: "" });
        schema.rear = new fields.StringField({ initial: "" });
        schema.availability = new fields.StringField({ initial: "" });
        schema.speed = new fields.ObjectField({});
        schema.crew = new fields.StringField({ initial: "" });
        schema.manoeuverability = new fields.NumberField({ initial: 0 });
        schema.carryingCapacity = new fields.NumberField({ initial: 0 });
        schema.integrity = new fields.ObjectField({});
        return schema;
    }
}

export class DHItemModel extends foundry.abstract.TypeDataModel {
    static htmlFields = ["description", "source", "benefit"];

    static defineSchema() {
        return {
            craftsmanship: new fields.StringField({ initial: "Common" }),
            availability: new fields.StringField({ initial: "Common" }),
            weight: new fields.NumberField({ initial: 0 }),
            equipped: new fields.BooleanField({ initial: false }),
            inBackpack: new fields.BooleanField({ initial: false }),
            backpack: new fields.ObjectField({}),
            description: new fields.HTMLField({ initial: "" }),
            source: new fields.HTMLField({ initial: "" }),
            benefit: new fields.HTMLField({ initial: "" }),
            action: new fields.ObjectField({}),
            target: new fields.ObjectField({}),
            damage: new fields.StringField({ initial: "" }),
            damageType: new fields.StringField({ initial: "" }),
            penetration: new fields.StringField({ initial: "" }),
            special: new fields.ObjectField({}),
            range: new fields.StringField({ initial: "" }),
            attackType: new fields.StringField({ initial: "" }),
            attackBonus: new fields.NumberField({ initial: 0 }),
            rateOfFire: new fields.ObjectField({}),
            container: new fields.BooleanField({ initial: false }),
            containerTypes: new fields.ArrayField(new fields.StringField(), { initial: [] }),
            class: new fields.StringField({ initial: "" }),
            type: new fields.StringField({ initial: "" }),
            reload: new fields.StringField({ initial: "" }),
            clip: new fields.ObjectField({}),
            modifications: new fields.ArrayField(new fields.ObjectField({}), { initial: [] }),
            armourPoints: new fields.ObjectField({}),
            hasArmourPoints: new fields.BooleanField({ initial: false }),
            protectionRating: new fields.NumberField({ initial: 0 }),
            activated: new fields.BooleanField({ initial: false }),
            overloaded: new fields.BooleanField({ initial: false }),
            maxAgility: new fields.NumberField({ initial: 0 }),
            level: new fields.NumberField({ initial: 0 }),
            enabled: new fields.BooleanField({ initial: true }),
            hasLevel: new fields.BooleanField({ initial: false }),
            weaponType: new fields.StringField({ initial: "" }),
            cost: new fields.NumberField({ initial: 0 }),
            sustained: new fields.StringField({ initial: "No" }),
            discipline: new fields.StringField({ initial: "" }),
            subtype: new fields.StringField({ initial: "" }),
            prerequisites: new fields.StringField({ initial: "" }),
            aptitudes: new fields.StringField({ initial: "" }),
            tier: new fields.NumberField({ initial: 0 }),
            location: new fields.StringField({ initial: "" }),
            name: new fields.StringField({ initial: "" }),
            modifier: new fields.NumberField({ initial: 0 }),
            time: new fields.StringField({ initial: "" }),
            place: new fields.StringField({ initial: "" }),
        };
    }
}

export function registerDataModels() {
    CONFIG.Actor.dataModels["acolyte"] = DHAcolyteModel;
    CONFIG.Actor.dataModels["npc"] = DHNpcModel;
    CONFIG.Actor.dataModels["vehicle"] = DHVehicleModel;

    const itemTypes = [
        "ammunition",
        "aptitude",
        "armour",
        "armourModification",
        "attackSpecial",
        "backpack",
        "consumable",
        "criticalInjury",
        "cybernetic",
        "drug",
        "enemy",
        "forceField",
        "gear",
        "journalEntry",
        "malignancy",
        "mentalDisorder",
        "mutation",
        "peer",
        "psychicPower",
        "specialAbility",
        "storageLocation",
        "talent",
        "tool",
        "trait",
        "weapon",
        "weaponModification",
    ];
    for (const type of itemTypes) CONFIG.Item.dataModels[type] = DHItemModel;
}
