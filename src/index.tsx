import React, {
  useEffect,
  useState,
  ReactNode,
  FunctionComponent
} from 'react';
import wrapRootComponent, {
  RootSiblingManager
} from 'react-native-root-siblings/lib/wrapRootComponent';
import ChildrenWrapper from 'react-native-root-siblings/lib/ChildrenWrapper';

const portalManagers: Map<string, RootSiblingManager> = new Map();
let portalUuid = 0;

function createPortalId(id: number): string {
  return `portal:${id}`;
}

export function isPortalExisted(name: string): boolean {
  return portalManagers.has(name);
}

export function enterPortal(
  target: string,
  guest: ReactNode,
  callback?: () => void
) {
  const manager = portalManagers.get(target);
  const id = createPortalId(++portalUuid);

  if (manager) {
    manager.update(id, guest, callback);
  } else {
    throw new Error(
      `react-native-root-portal: Can not find target PortalExit named:'${target}'.`
    );
  }

  return {
    update: (updater: ReactNode, updateCallback?: () => void) => {
      manager.update(id, updater, updateCallback);
    },
    destroy: (destroyCallback?: () => void) =>
      manager.destroy(id, destroyCallback)
  };
}

export function PortalEntry(props: { children: ReactNode; target: string }) {
  const { children, target } = props;
  const manager = portalManagers.get(target);
  const [id] = useState<number>(portalUuid);

  if (id === portalUuid) {
    portalUuid++;
  }

  useEffect(() => {
    if (manager) {
      return () => manager.destroy(createPortalId(id));
    }
  }, [manager]);

  if (manager) {
    manager.update(createPortalId(id), <>{children}</>);
  } else {
    console.error(
      `react-native-root-portal: Can not find target PortalExit named:'${target}'.`
    );
  }

  return null;
}

export function PortalExit(props: { name: string }) {
  const { name } = props;

  const [sibling] = useState<{
    Root: FunctionComponent;
    manager: RootSiblingManager;
  }>(() => {
    const { Root, manager } = wrapRootComponent(ChildrenWrapper);

    if (isPortalExisted(name)) {
      console.warn(
        `react-native-root-portal: Another PortalExit named:'${name}' is already existed.`
      );
    }

    portalManagers.set(name, manager);
    return {
      Root,
      manager
    };
  });

  useEffect(() => {
    if (sibling) {
      portalManagers.set(name, sibling.manager);
      return () => {
        portalManagers.delete(name);
      };
    }
  }, [name, sibling]);

  const { Root } = sibling;
  return <Root />;
}

export default {
  Entry: PortalEntry,
  Exit: PortalExit,
  isExisted: isPortalExisted,
  enter: enterPortal
};
