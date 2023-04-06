import { HexColorPicker } from "react-colorful";
import { useEffect, useState } from "react";
import "../styles/Home.css"

type Item = {
  id: number;
  color: string;
};

export const Home = () => {
  const [record, setRecord] = useState(false);  //Добавить новую запись в историю
  const [border, setBorder] = useState(true);  //Границы
  const [isMouseDown, setIsMouseDown] = useState(false);  //Проверка нажатия мышки
  const [color, setColor] = useState("#aabbcc");  //Выбранный цвет
  const [tableInfoHistoryIndex, setTableInfoHistoryIndex] = useState<any>(undefined); //Индекс позиции в массиве гридов
  const [viewTable, setViewTable] = useState<any>([]);  //Основной грид
  const [viewTableHistory, setViewTableHistory] = useState<any>([]);  //Массив гридов, история
  const [tableInfo, setTableInfo] = useState<any>({ //Настройки грида
    height: 200,
    width: 200,
    rows: 5,
    columns: 5,
  });
  let defTable = {  //Сброс настроек грида
    height: 200,
    width: 200,
    rows: 5,
    columns: 5
  }
  const updateItemById = (id: number, updateFn: (item: Item) => Item) => {  //Обновление основного грида
    setViewTable((prevState: any) => {
      return prevState.map((item: any) => {
        if (item.id === id) {
          return updateFn(item);
        }
        return item;
      });
    });
  };
  const handleMouseMove = (id: number) => { //Мышка на элементе
    if (isMouseDown) { //Проверка на нажатие мышки
      const check = viewTable.find((item: any) => item.id === id);
      if (check.color !== color) { //Проверка на повтор цвета
        updateItemById(id, (item) => {
          return { ...item, color: color };
        });
      }
    }
  }
  const handleMouseDown = () => { //Мышка нажата
    setTableInfoHistoryIndex(viewTableHistory.length)
    setIsMouseDown(!isMouseDown);
  };
  const handleMouseUp = () => { //Мышка отжата
    setIsMouseDown(!isMouseDown);
    setRecord(!record) //Новая запись в историю
  };
  const handleMouseClick = (id: number) => {  //Мышка клик
    setIsMouseDown(false);
    const check = viewTable.find((item: any) => item.id === id);
    if (check.color !== color) { //Проверка на повтор цвета
      updateItemById(id, (item) => {
        return { ...item, color: color };
      });
    }
  };
  useEffect(() => { //Обновление основного грида при помощи индекса истории
    if (tableInfoHistoryIndex !== undefined && tableInfoHistoryIndex !== viewTableHistory.length) {
      const objectIndex = viewTableHistory.find((obj: any, i: any) => i === (tableInfoHistoryIndex));
      if (objectIndex) {
        setViewTable(objectIndex);  //Обновление отображаемого грида
      }
    }
  }, [tableInfoHistoryIndex])
  useEffect(() => { //Обновление настроек грида
    let newViewTable = tableInfo.rows * tableInfo.columns;
    let newViewTableArray: any = [];
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
    if (viewTable.length !== 0) {
      setViewTableHistory([...viewTableHistory, viewTable])
    }
  }, [record]);

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
      <div className="Home__Table" onMouseDown={() => { handleMouseDown() }} onMouseUp={() => { handleMouseUp() }} style={{ gridTemplateColumns: `repeat(${tableInfo.columns}, ${tableInfo.height}px)`, gridTemplateRows: `repeat(${tableInfo.rows}, ${tableInfo.width}px)`}}>
        {viewTable.map((e: any, id: any) =>
          <div key={id} className="Home__Table__Item" onClick={() => { handleMouseClick(e.id) }} onMouseMove={() => { handleMouseMove(e.id) }} style={{ backgroundColor: `${e.color}`, width: `${tableInfo.height}px`, height: `${tableInfo.width}px`,border: border ? "1px solid black" : "0px solid black"  }}>
          </div>
        )}
      </div>
    </div>
  );
};
