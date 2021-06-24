class A {
  public vv() {

  }
}

class B extends A {
  public override vv() {
    console.log(111);
  }
}

new B().vv();
