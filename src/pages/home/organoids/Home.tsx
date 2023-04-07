import { HexColorPicker } from "react-colorful";
import { useEffect, useState } from "react";
import "../styles/Home.css"

type Item = {
  id: number
  color: string
};
type Table = {
  height: number
  width: number
  rows: number
  columns: number
};
export const Home = () => {
  const [record, setRecord] = useState<boolean>(false);  //Добавить новую запись в историю
  const [border, setBorder] = useState<boolean>(true);  //Границы
  const [click, setClick] = useState<boolean>(true);  //Click
  const [isMouseDown, setIsMouseDown] = useState<boolean>(false);  //Проверка нажатия мышки
  const [color, setColor] = useState<string>("#aabbcc");  //Выбранный цвет
  const [tableInfoHistoryIndex, setTableInfoHistoryIndex] = useState<any>(undefined); //Индекс позиции в массиве гридов
  const [viewTable, setViewTable] = useState<Item[]>([]);  //Основной грид
  const [viewTableHistory, setViewTableHistory] = useState<Item[][]>([]);  //Массив гридов, история
  const [tableInfo, setTableInfo] = useState<Table>({ //Настройки грида
    height: 200,
    width: 200,
    rows: 5,
    columns: 5,
  });
  let defTable: Table = {  //Сброс настроек грида
    height: 200,
    width: 200,
    rows: 5,
    columns: 5
  }
  const updateItemById = (id: number, updateFn: (item: Item) => Item) => {  //Обновление основного грида
    setViewTable((prevState: Item[]) => {
      return prevState.map((item: Item) => {
        if (item.id === id) {
          return updateFn(item);
        }
        return item;
      });
    });
  };
  const handleMouseMove = (id: number) => { //Мышка на элементе
    if (isMouseDown && click) { //Проверка на нажатие мышки
      const check = viewTable.find((item: Item) => item.id === id);
      if (check && check.color !== color) { //Проверка на повтор цвета
        updateItemById(id, (item) => {
          return { ...item, color: color };
        });
      }
    }
  }
  const handleMouseDown = () => { //Мышка нажата
    console.log("handleMouseDown")
    setTableInfoHistoryIndex(viewTableHistory.length)
    setIsMouseDown(true);
  };
  const handleMouseUp = () => { //Мышка отжата
    if (click) {
      console.log("handleMouseUp")
      setIsMouseDown(false);
      setRecord(!record) //Новая запись в историю
    }
  };
  const handleMouseClick = (id: number) => {  //Мышка клик
    console.log("handleMouseClick")
    setClick(false)
    setIsMouseDown(false);
    const check = viewTable.find((item: Item) => item.id === id);
    if (check && check.color !== color) { //Проверка на повтор цвета
      updateItemById(id, (item) => {
        return { ...item, color: color };
      });
      setClick(true)
      setRecord(!record) //Новая запись в историю
    }
  };
  useEffect(() => { //Обновление основного грида при помощи индекса истории
    if (tableInfoHistoryIndex !== undefined && tableInfoHistoryIndex !== viewTableHistory.length) {
      const objectIndex = viewTableHistory.find((obj: Item[], i: number) => i === (tableInfoHistoryIndex));
      if (objectIndex) {
        setViewTable(objectIndex);  //Обновление отображаемого грида
      }
    }
  }, [tableInfoHistoryIndex])
  useEffect(() => { //Обновление настроек грида
    let newViewTable = tableInfo.rows * tableInfo.columns;
    let newViewTableArray: Item[] = [];
    for (let i = 0; i < newViewTable; i++) {
      newViewTableArray.push({ id: i, color: "" })
    }
    if (newViewTableArray.length !== 0) {
      setTableInfoHistoryIndex(0)
      setViewTableHistory([])
      setViewTable(newViewTableArray)
    }
    setRecord(!record) //Новая запись в историю
  }, [tableInfo])
  useEffect(() => {
    setIsMouseDown(false)
  }, [color])
  useEffect(() => { //Реакция на новую запись в историю
    if (viewTable && viewTable.length !== 0) {
      setViewTableHistory([...viewTableHistory, viewTable])
    }
  }, [record]);

  useEffect(() => {
    console.log("viewTableHistory", viewTableHistory)
  }, [viewTableHistory])
  return (
    <div className="Home">
      <div className="Home__Title">Cyril Strone Paint</div>
      <div className="Home__ToolBar">
        <div className="Home__ToolBar__Item">
          <HexColorPicker color={color} onChange={setColor} />
        </div>
        <div className="Home__ToolBar__Item">
          <div className="Home__ToolBar__Item__Input">
            <label>Высота:</label>
            <input
              type="number"
              value={tableInfo.height}
              onChange={(event) => {
                setTableInfo({ ...tableInfo, height: Number(event.target.value) });
              }}
            />
          </div>
          <div className="Home__ToolBar__Item__Input">
            <label>Ширина:</label>
            <input
              type="number"
              value={tableInfo.width}
              onChange={(event) => {
                setTableInfo({ ...tableInfo, width: Number(event.target.value) });
              }}
            />
          </div>
          <div className="Home__ToolBar__Item__Input">
            <label>Кол-во строк:</label>
            <input
              type="number"
              value={tableInfo.rows}
              onChange={(event) => {
                setTableInfo({ ...tableInfo, rows: Number(event.target.value) });
              }}
            />
          </div>
          <div className="Home__ToolBar__Item__Input">
            <label>Кол-во столбцов:</label>
            <input
              type="number"
              value={tableInfo.columns}
              onChange={(event) => {
                setTableInfo({ ...tableInfo, columns: Number(event.target.value) });
              }}
            />
          </div>
          <div className="Home__ToolBar__Item__Input">
            <label>Границы</label>
            <input
              type="checkbox"
              checked={border}
              onChange={(event) => {
                setBorder(event.target.checked)
              }}
            />
          </div>
          <div className="Home__ToolBar__Item__Button">
            <button
              onClick={() => {
                setTableInfo(defTable);
              }}
            >
              Отмена
            </button>
          </div>
          <div className="Home__ToolBar__Item__Button">
            <button
              onClick={() => {
                tableInfoHistoryIndex !== 0 &&
                  setTableInfoHistoryIndex(tableInfoHistoryIndex - 1);
              }}
            >
              Назад
            </button>
            <button
              onClick={() => {
                tableInfoHistoryIndex !== viewTableHistory.length - 1 &&
                  setTableInfoHistoryIndex(tableInfoHistoryIndex + 1);
              }}
            >
              Вперед
            </button>
          </div>
        </div>
      </div>
      <div className="Home__Table" style={{ gridTemplateColumns: `repeat(${tableInfo.columns}, ${tableInfo.height}px)`, gridTemplateRows: `repeat(${tableInfo.rows}, ${tableInfo.width}px)` }}>
        {viewTable && viewTable.map((e: Item, id: number) =>
          <div key={id} className="Home__Table__Item" onClick={() => { handleMouseClick(e.id) }} onMouseDown={() => { handleMouseDown() }} onMouseUp={() => { handleMouseUp() }}  onMouseMove={() => { handleMouseMove(e.id) }} style={{ backgroundColor: `${e.color}`, width: `${tableInfo.height}px`, height: `${tableInfo.width}px`, border: border ? "1px solid black" : "0px solid black" }}>
          </div>
        )}
      </div>
    </div>
  );
};
