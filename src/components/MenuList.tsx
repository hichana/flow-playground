import React, {SyntheticEvent, useEffect, useRef, useState} from "react";
import {IoMdAddCircleOutline} from "react-icons/io";
import {FaPen, FaTimes} from "react-icons/fa";
import {SidebarSection} from "layout/SidebarSection";
import {SidebarHeader} from "layout/SidebarHeader";
import {SidebarItems} from "layout/SidebarItems";
import {SidebarItem} from "layout/SidebarItem";
import {SidebarItemInsert} from "layout/SidebarItemInsert";
import {SidebarItemInput} from "layout/SidebarItemInput";
import {SidebarItemEdit} from "layout/SidebarItemEdit";
import {SidebarItemDelete} from "layout/SidebarItemDelete";
import useKeyPress from "../hooks/useKeyPress";
import { ExportButton } from "components/ExportButton";
import AutoTemplatePopup from "components/AutoTemplatePopup"
import { getParams } from "../util/url";
import { getStorageData } from "../util/storage"
import { useProject } from "providers/Project/projectHooks";
import { EntityType } from "providers/Project";
import { useLocation } from "@reach/router";
import { storageMap } from '../util/accounts';

type MenuListProps = {
  active: number | null;
  title: string;
  items: any[];
  onSelect: (e: SyntheticEvent, id: string) => void;
  onUpdate: any;
  onDelete: any;
};

const NAME_MAX_CHARS = 50;

const MenuList: React.FC<MenuListProps> = ({
  title,
  items,
  onSelect,
  onUpdate,
  onDelete
}) => {
  const { active, project, selectedResourceAccount } = useProject()

  const selectedAcctState = project.accounts[storageMap[selectedResourceAccount] || 0].state

  const { storage, paths, types } = getStorageData(selectedAcctState)
  const [showTemplatePopup, toggleShowTemplatePopup] = useState<boolean>(false)

  const isEditing = useRef<HTMLInputElement>();
  const [editing, setEditing] = useState([]);
  const enterPressed = useKeyPress("Enter");
  const escapePressed = useKeyPress("Escape");

  const toggleEditing = (i: number, newTitle: string) => {
    if (editing.includes(i)) {
      let _editing = [...editing];
      _editing.splice(_editing.indexOf(i), 1);
      setEditing(_editing);
      onUpdate(items[i].id, items[i].script, newTitle);
      return;
    }
    return setEditing([...editing, i]);
  };


  useEffect(() => {
    setEditing([]);
  }, [items, active]);

  useEffect(() => {
    if (enterPressed || escapePressed) {
      setEditing([]);
      isEditing.current?.blur();
    }
  }, [enterPressed, escapePressed]);

  const setEditingRef = (element: HTMLInputElement | undefined) => {
    isEditing.current = element;
    element?.focus();
    element?.select()
  };

  const isScript = title.toLowerCase().includes("script");
  const itemType = isScript ? EntityType.ScriptTemplate : EntityType.TransactionTemplate

  const location = useLocation();
  const params = getParams(location.search)

  return (
    <>
      <SidebarSection>
        <SidebarHeader>
          {title}
          <SidebarItemInsert onClick={() => {
              // (e: React.SyntheticEvent) => onInsert(e)
              toggleShowTemplatePopup(true)
          }}
          >
            <IoMdAddCircleOutline size="20px" />
          </SidebarItemInsert>
        </SidebarHeader>
        <SidebarItems>
          {items.map((item, i) => {
            const isActive = active.type === itemType && item.id === params.id
            return (
              <SidebarItem
                title={item.title}
                key={item.id}
                active={isActive}
                onClick={(e: React.SyntheticEvent<Element, Event>) =>
                  onSelect(e, item.id)
                }
              >
                {/* NOTE: Optimize this to a controlled input! */}
                <SidebarItemInput
                  ref={editing.includes(i) ? setEditingRef : () => {}}
                  type="text"
                  onBlur={(e: any) => {
                    if (e.target.value.length === 0) {
                      isEditing.current.value = item.title;
                    } else {
                      toggleEditing(i, e.target.value);
                    }
                  }}
                  defaultValue={item.title}
                  readonly={!editing.includes(i)}
                  onChange={e => {
                    if (e.target.value.length > NAME_MAX_CHARS) {
                      isEditing.current.value = e.target.value.substr(
                        0,
                        NAME_MAX_CHARS - 1
                      );
                    }
                  }}
                />
                {isActive && (
                  <>
                    <SidebarItemEdit onClick={() => toggleEditing(i, item.title)}>
                      <FaPen />
                    </SidebarItemEdit>

                    <ExportButton id={item.id} typeName={item.__typename}/>
                  </>
                )}

                {!editing.includes(i) && isActive && items.length > 1 && (
                  <SidebarItemDelete
                    onClick={(e: any) => {
                      e.stopPropagation();
                      onDelete(item.id);
                    }}>
                    <FaTimes />
                  </SidebarItemDelete>
                )}
              </SidebarItem>
            );
          })}
        </SidebarItems>
      </SidebarSection>
      <AutoTemplatePopup 
        type={title.split(" ")[0]}
        storage={storage}
        paths={paths}
        visible={showTemplatePopup} 
        options={types}
        triggerClose={() => {
          toggleShowTemplatePopup(false)
        }} 
      />
    </>
  );
};

export default MenuList;
