import { Sequelize } from "sequelize";
import sequelize from "./database";

jest.mock("sequelize");
describe("Sequelize Initialization", () => {
  it("must instantiate Sequelize with the sqlite dialect and the correct file path", () => {
    expect(Sequelize).toHaveBeenCalledWith({
      dialect: "sqlite",
      storage: "./database.sqlite",
    });
  });

  it("must export an instance of Sequelize", () => {
    expect(sequelize).toBeInstanceOf(Sequelize);
  });
});
