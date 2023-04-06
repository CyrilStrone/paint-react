import { HexColorPicker } from "react-colorful";
import React, { useEffect, useState } from "react";
import "../styles/Home.css"

type Item = {
  id: number;
  color: string;
};

export const Home = () => {
  const [checkTime, setCheckTime] = useState(false);

  const [record, setRecord] = useState(false);
  const [oldId, setOldId] = useState<number>();
  const [isMouseDown, setIsMouseDown] = useState(false);
  const [color, setColor] = useState("#aabbcc");
  const [brushOrEraser, setBrushOrEraser] = useState(false);

  const [tableInfo, setTableInfo] = useState<any>({
    height: 25,
    width: 50,
    rows: 10,
    columns: 10,
  });
  const [defTable] = useState<any>({
    height: 25,
    width: 50,
    rows: 10,
    columns: 10,
  });

  const [tableInfoHistory, setTableInfoHistory] = useState<any>([]);
  const [tableInfoHistoryId, setTableInfoHistoryId] = useState<any>(1);

  const [viewTable, setViewTable] = useState<any>([]);
  const [viewTableHistory, setViewTableHistory] = useState<any>([]);

  const updateItemById = (id: number, updateFn: (item: Item) => Item) => {
    setViewTable((prevState: any) => {
      return prevState.map((item: any) => {
        if (item.id === id) {
          return updateFn(item);
        }
        return item;
      });
    });
  };

  const handleMouseMove = (id: number) => {
    if (isMouseDown) {
      console.log("handleMouseMove")
      if (oldId !== id) {
        const check = viewTable.find((item: any) => item.id === id);
        if (check.color !== color) {
          updateItemById(id, (item) => {
            return { ...item, color: color };
          });
        }
      }
    }
  }
  const handleMouseDown = () => {
    setCheckTime(false)
    console.log("tableInfoHistoryId", tableInfoHistoryId)
    // setTableInfoHistory(tableInfoHistory.slice(0, tableInfoHistoryId - 1))
    setTableInfoHistoryId(1)
    setIsMouseDown(!isMouseDown);
  };
  const handleMouseUp = () => {
    setIsMouseDown(!isMouseDown);
    setRecord(!record)
  };
  const handleMouseClick = (id: number) => {
    setIsMouseDown(false);
    const check = viewTable.find((item: any) => item.id === id);
    if (check.color !== color) {
      updateItemById(id, (item) => {
        return { ...item, color: color };
      });
    }
  };

  const handleTime = (time: boolean) => {
    setCheckTime(true)
    if (time) {
      setTableInfoHistoryId(tableInfoHistoryId - 1)
    } else {
      setTableInfoHistoryId(tableInfoHistoryId + 1)

    }

  };
  useEffect(() => {
    console.log(viewTableHistory.length, viewTableHistory, tableInfoHistoryId)
    if (checkTime) {
      if (viewTableHistory[viewTableHistory.length - tableInfoHistoryId]) {
        setViewTable(viewTableHistory[viewTableHistory.length - tableInfoHistoryId]);
      }
    }
  }, [tableInfoHistoryId])

  useEffect(() => {
    let newViewTable = tableInfo.rows * tableInfo.columns;
    let newViewTableArray: any = [];
    for (let i = 0; i < newViewTable; i++) {
      newViewTableArray.push({ id: i, color: "" })
    }
    if (newViewTableArray.length !== 0) {
      setViewTable(newViewTableArray)
    }
    setRecord(!record)
  }, [tableInfo])


  useEffect(() => {
    setIsMouseDown(false)
    setOldId(undefined)
  }, [color])

  useEffect(() => {
    if (viewTable.length !== 0) {
      setViewTableHistory([...viewTableHistory, viewTable])
      setTableInfoHistory([...tableInfoHistory, tableInfo])
    }
  }, [record]);


  return (
    <div className="Home">
      <div className="tool-panel">
        <div className="tool-panel-item">
          <HexColorPicker color={color} onChange={setColor} />
        </div>
        <div className="tool-panel-item">
          <select
            value={brushOrEraser.toString()}
            onChange={(event: any) => {
              setBrushOrEraser(event.target.value);
            }}
          >
            <option value={"true"}>Кисть</option>
            <option value={"false"}>Ластик</option>
          </select>
        </div>
        <div className="tool-panel-item">
          <div className="tool-panel-input">
            <label>Высота:</label>
            <input
              type="number"
              value={tableInfo.height}
              onChange={(event) => {
                setTableInfo({ ...tableInfo, height: Number(event.target.value) });
              }}
            />
          </div>
          <div className="tool-panel-input">
            <label>Ширина:</label>
            <input
              type="number"
              value={tableInfo.width}
              onChange={(event) => {
                setTableInfo({ ...tableInfo, width: Number(event.target.value) });
              }}
            />
          </div>
          <div className="tool-panel-input">
            <label>Кол-во строк:</label>
            <input
              type="number"
              value={tableInfo.rows}
              onChange={(event) => {
                setTableInfo({ ...tableInfo, rows: Number(event.target.value) });
              }}
            />
          </div>
          <div className="tool-panel-input">
            <label>Кол-во столбцов:</label>
            <input
              type="number"
              value={tableInfo.columns}
              onChange={(event) => {
                setTableInfo({ ...tableInfo, columns: Number(event.target.value) });
              }}
            />
          </div>
          <div className="tool-panel-item">
            <button
              onClick={() => {
                setTableInfo(defTable);
              }}
            >
              Отмена
            </button>
          </div>
          <div className="tool-panel-item">
            <button
              onClick={() => {
                handleTime(false);
              }}
            >
              Назад
            </button>
            <button
              onClick={() => {
                handleTime(true);
              }}
            >
              Вперед
            </button>
          </div>
          <div>
          </div>
          {/* <div className="tool-panel-item">
            <button onClick={updateTable}>Обновить сетку</button>
          </div> */}
        </div>
      </div>
      <div className="table" onMouseDown={() => { handleMouseDown() }} onMouseUp={() => { handleMouseUp() }} style={{ gridTemplateColumns: `repeat(${tableInfo.columns}, ${tableInfo.height}px)`, gridTemplateRows: `repeat(${tableInfo.rows}, ${tableInfo.width}px)` }}>
        {viewTable.map((e: any) =>
          <div className="table__Item" onClick={() => { handleMouseClick(e.id) }} onMouseMove={() => { handleMouseMove(e.id) }} style={{ backgroundColor: `${e.color}`, width: `${tableInfo.height}px`, height: `${tableInfo.width}px` }}>
          </div>
        )}
      </div>
    </div>
  );
};
