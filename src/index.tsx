import { useEffect, useState, ReactNode, FunctionComponent } from 'react';
import wrapRootComponent, { RootSiblingManager } from 'react-native-root-siblings/lib/wrapRootComponent';
import ChildrenWrapper from 'react-native-root-siblings/lib/ChildrenWrapper';

const portalManagers: Map<string, RootSiblingManager> = new Map();
let portalUuid = 0;

export function isPortalExisted(name: string) {
  return portalManagers.has(name);
}

export function PortalEntry(props: { children: ReactNode, target: string }): ReactNode {
  const { children, target } = props;
  const manager = portalManagers.get(target);
  const [id] = useState<number>(portalUuid);

  if (id === portalUuid) {
    portalUuid++;
  }

  useEffect(() => {
    if (manager) {
      return () => manager.destroy(id.toString());
    }
  }, [manager]);

  if (manager) {
    manager.update(id.toString(), <>{children}</>);
  } else {
    console.error(`react-native-root-portal: Can not find target PortalExit named:'${target}'.`);
  }



  return null;
}

export function PortalExit(props: { name: string }): ReactNode {
  const [sibling, setSibling ] = useState<{
    Root: FunctionComponent;
    manager: RootSiblingManager;
  } | null>(null);

  const { name } = props;
  useEffect(() => {
    if (sibling) {
      portalManagers.set(name, sibling.manager);
      return () => {
        portalManagers.delete(name);
      }
    }
  }, [name, sibling]);

  if (!sibling) {
    const { Root, manager } = wrapRootComponent(ChildrenWrapper);

    if (isPortalExisted(props.name)) {
      console.error(`react-native-root-portal: Another PortalExit named:'${name}' is already existed.`);
      return null;
    }

    portalManagers.set(props.name, manager);
    setSibling({
      Root,
      manager
    });
    return <Root />;
  } else {
    const { Root } = sibling;
    return <Root />;
  }
}

export default {
  Entry: PortalEntry,
  Exit: PortalExit,
  isExisted: isPortalExisted
}
