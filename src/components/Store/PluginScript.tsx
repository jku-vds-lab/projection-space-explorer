import { PSEPlugin } from './PSEPlugin';

export function getStoreDiff(storeA, storeB) {
  const diff = {};

  for (const key in storeA) {
    const valA = storeA[key];
    const valB = storeB[key];

    if (valA !== valB) {
      diff[key] = valB;
    }
  }

  return diff;
}

export class PluginRegistry {
  private static instance: PluginRegistry;

  private plugins: PSEPlugin[] = [];

  private reducers: any[] = [];

  private constructor() {}

  public static getInstance(): PluginRegistry {
    if (!PluginRegistry.instance) {
      PluginRegistry.instance = new PluginRegistry();
    }

    return PluginRegistry.instance;
  }

  public getPlugin(type: string) {
    for (const plugin of this.plugins) {
      if (plugin.type === type) {
        return plugin;
      }
    }

    return null;
  }

  public registerPlugin(plugin: PSEPlugin) {
    this.plugins.push(plugin);
  }

  public registerReducer(reducer: any) {
    this.reducers.push(reducer);
  }
}
