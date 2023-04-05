import { HexColorPicker } from "react-colorful";
import React, { useEffect, useState } from "react";

export const Home = () => {
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
  
  const [viewTable,setViewTable] = useState<any>([]);
  useEffect(() => {
    console.log("brushOrEraser", brushOrEraser);
  }, [brushOrEraser]);

  const updateTable = () => {
    let newViewTable = tableInfo.rows * tableInfo.columns;
    let newViewTableArray:any = [];
    for (let i = 0; i < newViewTable; i++) {
      newViewTableArray.push({id:i,color:"#ffffff"})
    }
    if(newViewTableArray.length !== 0){
      setViewTable(newViewTableArray)
    }
  };

  return (
    <div className="Home">
      <div className="tool-panel">
        <div className="tool-panel-item">
          <HexColorPicker color={color} onChange={setColor} />
        </div>
        <div className="tool-panel-item">
          <select
            value={brushOrEraser.toString()}
            onChange={(event:any) => {
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
                setTableInfo({ ...tableInfo, height: event.target.value });
              }}
            />
          </div>
          <div className="tool-panel-input">
            <label>Ширина:</label>
            <input
              type="number"
              value={tableInfo.width}
              onChange={(event) => {
                setTableInfo({ ...tableInfo, width: event.target.value });
              }}
            />
          </div>
          <div className="tool-panel-input">
            <label>Кол-во строк:</label>
            <input
              type="number"
              value={tableInfo.rows}
              onChange={(event) => {
                setTableInfo({ ...tableInfo, rows: event.target.value });
              }}
            />
          </div>
          <div className="tool-panel-input">
            <label>Кол-во столбцов:</label>
            <input
              type="number"
              value={tableInfo.columns}
              onChange={(event) => {
                setTableInfo({ ...tableInfo, columns: event.target.value });
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
            <button onClick={updateTable}>Обновить сетку</button>
          </div>
        </div>
      </div>
      <div className="table">
              {viewTable.map((e:any)=>
                <div className="table__Item" style={{color:`${e.color}`}}>

                </div>
              )}
      </div>
    </div>
  );
};
