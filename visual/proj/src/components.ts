export class HLRegister{
    dataBus : Bus 
    addressBus : Bus 

    READ_ABUS  : boolean
    WRITE_ABUS  : boolean
    H : Register_8
    L : Register_8

    constructor(dataBus : Bus  , addressBus : Bus ){
        // Read and write data bus individually
        // Read and write Address bus jointly.
        this.H = new Register_8(dataBus);
        this.L = new Register_8(dataBus);

        this.dataBus = dataBus;
        this.addressBus = addressBus;

        this.READ_ABUS = false;
        this.WRITE_ABUS = false;
    }
    readBus(){
        // reading from address bus. so word to byte
        if(!this.READ_ABUS) return;
        let data = this.addressBus.read();
        let {highByte, lowByte} = WordToBytes(data);
        this.H.data = highByte;
        this.L.data = lowByte;
    }
    writeBus(){
        if(!this.WRITE_ABUS) return;
        let word = BytesToWord(this.H.data,this.L.data);
        this.addressBus.write(word);
    }
    READ_ABUS_SET(){
        this.READ_ABUS = true;
    }
    WRITE_ABUS_SET(){
        this.WRITE_ABUS = true;
    }

    clearFlags(){
        this.READ_ABUS = false;
        this.WRITE_ABUS = false;
        this.H.clearFlags();
        this.L.clearFlags();
    }
}
  
  
export class Register_8{
    data : uint_8
    dataBus : Bus
    READ_DBUS  : boolean
    WRITE_DBUS  : boolean
    constructor(dataBus : Bus){
        this.data = 0x00;

        this.dataBus = dataBus;

        this.READ_DBUS = false;
        this.WRITE_DBUS = false;
    }
    readBus(){
        if(!this.READ_DBUS) return;
        this.data = this.dataBus.read();
    }
    writeBus(){
        if(!this.WRITE_DBUS) return;
        this.dataBus.write(this.data);
        
    }
    READ_DBUS_SET(){
        this.READ_DBUS = true;

    }
    WRITE_DBUS_SET(){
        this.WRITE_DBUS = true;
    }
    clearFlags(){
        this.READ_DBUS = false;
        this.WRITE_DBUS = false;
    }
}
  
export class Bus{
    public data : number
    constructor(){
        this.data = 0x00;
    }
    read(){
        return this.data
    }
    write(data : number){
        this.data = data
    }
}
  
export class ProgramCounter{
    PC_HIGH  :number
    PC_LOW : number
    bus : Bus
    PC_INCREMENT : boolean
    WRITE_ABUS : boolean
    READ_ABUS : boolean
    constructor(addressBus : Bus){
        this.PC_HIGH = 0x00
        this.PC_LOW = 0x00
        this.bus = addressBus;

        this.PC_INCREMENT = false;
        this.WRITE_ABUS = false;
        this.READ_ABUS = false;
    }
    setData(data : uint_16){
        let {lowByte, highByte} = WordToBytes(data);
        this.PC_HIGH = highByte;
        this.PC_LOW = lowByte;
    }
    data(){
        return BytesToWord(this.PC_HIGH,this.PC_LOW);
    }
    readBus(){
        if(!this.READ_ABUS) return;
        let word = this.bus.read();
        this.setData(word);
    }
    writeBus(){
        if(!this.WRITE_ABUS) return;
        let word = this.data();
        this.bus.write(word);
    }
    increment(){
        if(!this.PC_INCREMENT) return;
        let word = this.data();
        word++;
        let {lowByte, highByte} = WordToBytes(word);
        this.PC_LOW = lowByte;
        this.PC_HIGH= highByte;
    }
    PC_INCREMENT_SET(){
        this.PC_INCREMENT = true;
    }
    WRITE_ABUS_SET(){
        this.WRITE_ABUS = true;
    }
    READ_ABUS_SET(){
        this.READ_ABUS = true;
    }
    clearFlags(){
        this.PC_INCREMENT = false;
        this.WRITE_ABUS = false;
        this.READ_ABUS = false;
    }
}
  
type uint_8 = number
type uint_16 = number

  
export function WordToBytes(word: uint_16):{highByte : uint_8,lowByte  : uint_8}{
    let highByte : uint_8 = (word >> 8) & 0xFF;
    let lowByte : uint_8  = word & 0xFF
    return {highByte,lowByte};
}

export function BytesToWord(highByte : uint_8, lowByte : uint_8) : uint_16{
    let word : uint_16 = (highByte << 8) | lowByte
    return word
}
  
  
export class Memory{
    memory : Array<uint_8>;
    public addressBus : Bus
    public dataBus : Bus
    public MEMORY_READ : boolean
    public MEMORY_WRITE : boolean
    constructor(dataBus: Bus,addressBus : Bus){
        this.memory = new Array(65536).fill(0);
        this.addressBus = addressBus;
        this.dataBus = dataBus;
        this.MEMORY_READ = false;
        this.MEMORY_WRITE = false;
    }
    MEMORY_READ_SET(){
        this.MEMORY_READ = true;
    }
    MEMORY_WRITE_SET(){
        this.MEMORY_WRITE = true;
    }
    readMemory(){
        if(!this.MEMORY_READ) return;

        let address = this.addressBus.read();
        let data = this.memory[address];

        this.dataBus.write(data);
    }
    writeMemory(){
        if(!this.MEMORY_WRITE) return;
        let data = this.dataBus.read();
        let address = this.addressBus.read();
        this.memory[address] = data;
    }
    clearFlags(){
        this.MEMORY_READ = false;
        this.MEMORY_WRITE = false;
    }
};