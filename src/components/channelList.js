import React, { useContext } from "react";
import { UncontrolledTooltip } from "reactstrap";
import { MdDelete, MdEdit } from "react-icons/md";
import UserContext from "../context/userContext";
import Axios from "axios";
import { server } from "../utils/server";
import { message } from "antd";

const ChannelList = ({
  name,
  des,
  date,
  fields,
  number,
  c_id,
  channel_list,
  setData,
}) => {
  const context = useContext(UserContext);
  const warning = () => {
    message.error({
      content: `Deleted ${name}`,
      className: "custom-class",
      style: {
        marginTop: "10vh",
      },
    });
  };

  const deleteChannel = async () => {
    try {
      const token = context.user?.token;
      const config = {
        headers: {
          "content-type": "application/json",
        },
      };
      if (token) {
        config.headers["Authorization"] = `Token ${token}`;
      }
      await Axios({
        url: `${server}/channel/${c_id}/delete/`,
        method: "DELETE",
        headers: {
          Accept: "application/json",
          "Content-Type": "multipart/form-data",
          Authorization: `Token ${token}`,
        },
      }).then((res) => {
        const newList = channel_list.data.filter((i) => i.id != c_id);
        setData({ data: newList });
        warning();
      });
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <>
      <tbody>
        <tr>
          <th scope="row">{number}</th>
          <td>
            <a href={`channel/${c_id}`}>{name}</a>
          </td>
          <td>
            {date}
            <span style={{ float: "right" }}>
              {/* <MdEdit /> */}
              <MdDelete
                onClick={() => deleteChannel()}
                style={{ width: "20px", height: "20px", cursor: "pointer" }}
                color="danger"
                id="delete-btn"
                className="text-danger"
              />
              <UncontrolledTooltip placement="right" target="delete-btn">
                delete
              </UncontrolledTooltip>
            </span>
          </td>
        </tr>
      </tbody>
    </>
  );
};

export default ChannelList;
