import React from 'react';
import useClipboard from 'react-use-clipboard';
import { FaClipboard, FaClipboardCheck } from 'react-icons/fa';
import { SidebarItemExport } from 'layout/SidebarItemExport';
import { useProject } from 'providers/Project/projectHooks';
import { generateCode } from '../util/generate-code';

type ExportButtonProps = {
  id: string;
  typeName: string;
};

export const ExportButton = (props: ExportButtonProps) => {
  const { project } = useProject();
  // const { id, typeName } = props;
  // Milestone 2: use 'storage' param to force ExportButton to appear (ignoring ts error)
  const { id, typeName, storage } = props; 
  const code = generateCode(project.id, id, typeName);
  const [isCopied, setCopied] = useClipboard(code, {
    successDuration: 1000,
  });

  // return project.id === 'LOCAL-project' ? null : (
  // Milsetone 2: force ExportButton to appear for 0x01
  return (project.id === 'LOCAL-project' && storage === "0x01") ? null : ( 
    <SidebarItemExport
      onClick={setCopied}
      title={'Copy snippet to clipboard'}
      active={isCopied}
    >
      {isCopied ? <FaClipboardCheck /> : <FaClipboard />}
    </SidebarItemExport>
  );
};
