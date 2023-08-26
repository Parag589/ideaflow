
import { useState } from "react";
import { LuEdit } from "react-icons/lu";
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';

const MyApp = () => {
  // State variables
  const [ideasList, setIdeasList] = useState(["Enter your idea here"]);
  const [isDropdownVisible, setIsDropdownVisible] = useState([false]);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [inputValue, setInputValue] = useState(""); // Add state for input text

  // Handler for text change
  const handleTextChange = (event, index) => {
    const text = event.target.innerHTML;
    const updatedIdeasList = [...ideasList];
    updatedIdeasList[index] = text;
    setIdeasList(updatedIdeasList);
  };

  // Function to remove all dropdowns
  const removeAllDropdowns = () => {
    const updatedDropdownVisibility = isDropdownVisible.map(() => false);
    setIsDropdownVisible(updatedDropdownVisibility);
  };

  // Handler for dropdown
  const handleDropdown = (event, index) => {
    const text = event.target.textContent;
    if (text.includes("<>")) {
      isDropdownVisible[index] = true;
      setIsDropdownVisible([...isDropdownVisible]);
      setIsModalVisible(true);
    } else {
      isDropdownVisible[index] = false;
      setIsDropdownVisible([...isDropdownVisible]);
    }
  };

  // Handler for replacing text
  const handleReplaceText = (index, idea) => {
    const input = ideasList[index];
    // Define a regular expression pattern to match <span>...</span> tags
    const spanPattern = /<span\b[^>]*>.*?<\/span>/g;
    // Extract all <span>...</span> tags and store them in an array
    const spanTags = [];
    const tempInput = input.replace(spanPattern, (match) => {
      spanTags.push(match);
      return "%%SPAN%%";
    });
    // Replace occurrences of <> with "hello"
    const output = tempInput.replace(
      /&lt;&gt;/g,
      ` <span contentEditable=false disabled=true class="text-sky-300 font-medium"> &lt;&gt; ${idea}</span>`
    );
    // Put the <span>...</span> tags back in their positions
    let spanIndex = 0;
    const finalOutput = output.replace(/%%SPAN%%/g, () => spanTags[spanIndex++]);
    // return replaced;
    return finalOutput;
  };

  // Handler for dropdown click
  const handleDropdownClick = (index, idea) => {
    const updatedIdeasList = [...ideasList];
    updatedIdeasList[index] = handleReplaceText(index, idea);
    setIdeasList(updatedIdeasList);
    isDropdownVisible[index] = false;
    setIsDropdownVisible([...isDropdownVisible]);
    setIsModalVisible(false);
  };

  // Handler for input change
  const handleInputChange = (event) => {
    setInputValue(event.target.value);
  };

  // Handler for Add Item button click
  const handleAddItem = () => {
    setIdeasList([...ideasList, inputValue]);
    setInputValue("");
  };

  // Handler for deleting an item
  const handleDeleteItem = (index) => {
    const updatedIdeasList = ideasList.filter((idea, i) => i !== index);
    setIdeasList(updatedIdeasList);
  };

  // Render
  return (
    <div className=" min-h-screen overflow-y-scroll bg-slate-800 flex justify-center text-white py-5">
      {isModalVisible && (
        <div
          onClick={() => {
            removeAllDropdowns();
            setIsModalVisible(false);
          }}
          className="z-10 fixed h-screen w-screen inset-0"
        />
      )}
      <div className="mt-12 w-4/5 lg:w-3/5 flex flex-col gap-10">
        <div className="flex flex-col lg:flex-row gap-4">
          <input
            className="flex-grow flex flex-col md:flex-row gap-3 items-center md:justify-center bg-slate-900 px-4 py-3 rounded-md font-medium text-slate-200"
            type="text"
            id="name"
            name="name"
            value={inputValue}
            onChange={handleInputChange} // Add input change handler
          />
          <button
            onClick={handleAddItem} // Add click handler for Add Item button
            className="flex items-center bg-sky-500 py-2 rounded-md px-5 gap-3 hover:bg-sky-600 active:bg-sky-400 shadow-md"
          >
            <LuEdit className="text-lg" /> 
          </button>
        </div>
        <div className="flex flex-col">
          {ideasList.map((idea, index) => (
            <div
              key={index}
              className={`relative py-8 flex items-center ${
                index !== ideasList.length - 1 && "border-b border-slate-600"
              }`}
            >
              <div
                onBlur={(e) => handleTextChange(e, index)}
                onInput={(e) => handleDropdown(e, index)}
                contentEditable
                className="outline-none w-fit text-sm md:text-base"
                dangerouslySetInnerHTML={{ __html: idea }}
              />
              <div className="relative">
                {isDropdownVisible[index] && (
                  <div className="absolute text-xs w-32 md:w-80 z-10 top-3 md:text-sm bg-slate-900 px-4 pt-1 rounded-md flex flex-col">
                    {ideasList.map((idea, ideaIndex) => (
                      <div key={ideaIndex}>
                        {idea !== "" && (
                          <div
                            className={`cursor-pointer py-2 ${
                              ideaIndex !== ideasList.length - 1 &&
                              "border-b border-slate-600"
                            }`}
                            onClick={() => handleDropdownClick(index, idea)}
                          >
                            {
                              idea
                                .split("<")[0]
                                ?.split("&lt;")[0]
                                ?.split("&nbsp;")[0]
                            }
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>
              <button
                onClick={() => handleDeleteItem(index)} // Add click handler for delete button
                className="absolute right-0 top-1/2 transform -translate-y-1/2 text-white rounded-full p-2 hover:bg-white-600 opacity-30"
              >
                X
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default MyApp;