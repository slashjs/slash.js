import {
    APIApplicationCommandInteractionDataBasicOption,
    APIApplicationCommandInteractionDataOption,
    APIApplicationCommandInteractionDataStringOption,
    APIChatInputApplicationCommandInteractionDataResolved,
    APIInteractionDataResolvedChannel,
    APIInteractionDataResolvedGuildMember, APIRole, APIUser,
    ApplicationCommandOptionType
} from 'discord-api-types';

export class CommandOptions {
    private options: APIApplicationCommandInteractionDataBasicOption[];
    private subcommandGroup: string | null = null;
    private subcommand: string | null = null;

    constructor(options: APIApplicationCommandInteractionDataOption[], private resolved: APIChatInputApplicationCommandInteractionDataResolved) {
        if (options[0]?.type === ApplicationCommandOptionType.SubcommandGroup) {
            this.subcommandGroup = options[0].name;
            options = options[0].options ?? [];
        }

        if (options[0]?.type === ApplicationCommandOptionType.Subcommand) {
            this.subcommand = options[0].name;
            options = options[0].options ?? [];
        }

        this.options = options as APIApplicationCommandInteractionDataBasicOption[];
    }

    public get(name: string): string | number | boolean | null {
        const option = this.options.find((o) => o.name === name);
        if (!option) return null;
        return ('value' in option) ? option.value : null;
    }

    public getSubcommandGroup(): string | null {
        return this.subcommandGroup;
    }

    public getSubcommand(): string | null {
        return this.subcommand;
    }

    public getUser(name: string): APIUser | null {
        const option = this.options.find((o) => o.name === name && o.type === ApplicationCommandOptionType.User);
        if (!option) return null;
        return this.resolved.users?.[option.value as string] ?? null;
    }

    public getMember(name: string): APIInteractionDataResolvedGuildMember | null {
        const option = this.options.find((o) => o.name === name && o.type === ApplicationCommandOptionType.User);
        if (!option) return null;
        return this.resolved.members?.[option.value as string] ?? null;
    }

    public getChannel(name: string): APIInteractionDataResolvedChannel | null {
        const option = this.options.find((o) => o.name === name && o.type === ApplicationCommandOptionType.Channel);
        if (!option) return null;
        return this.resolved.channels?.[option.value as string] ?? null;
    }

    public getRole(name: string): APIRole | null {
        const option = this.options.find((o) => o.name === name && o.type === ApplicationCommandOptionType.Role);
        if (!option) return null;
        return this.resolved.roles?.[option.value as string] ?? null;
    }

    public getMentionable(name: string): APIUser | APIInteractionDataResolvedGuildMember | APIRole | null {
        const option = this.options.find((o) => o.name === name && o.type === ApplicationCommandOptionType.Role);
        if (!option) return null;
        return this.resolved.members?.[option.value as string]
            ?? this.resolved.users?.[option.value as string]
            ?? this.resolved.roles?.[option.value as string]
            ?? null;
    }

    public getString(name: string): string | null {
        const option = this.options.find((o) => o.name === name && o.type === ApplicationCommandOptionType.String);
        if (!option) return null;
        return option.value as string;
    }

    public getInteger(name: string): number | null {
        const option = this.options.find((o) => o.name === name && o.type === ApplicationCommandOptionType.Integer);
        if (!option) return null;
        return option.value as number;
    }

    public getNumber(name: string): number | null {
        const option = this.options.find((o) => o.name === name && o.type === ApplicationCommandOptionType.Number);
        if (!option) return null;
        return option.value as number;
    }

    public getBoolean(name: string): boolean | null {
        const option = this.options.find((o) => o.name === name && o.type === ApplicationCommandOptionType.Boolean);
        if (!option) return null;
        return option.value as boolean;
    }

    public getFocused(): APIApplicationCommandInteractionDataBasicOption | null {
        const option = this.options.find((o) => (o as APIApplicationCommandInteractionDataStringOption).focused);
        return option ?? null;
    }
}