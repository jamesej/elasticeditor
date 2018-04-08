interface CanReadWrite
{
    read(type: string, id: string): object;
    write(type: string, data: object);
}